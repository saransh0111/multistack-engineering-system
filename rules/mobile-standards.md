# Rule: Mobile Development Standards

**Owner:** Mobile Engineering  
**Last Updated:** 2026-04-06  
**Applies To:** All mobile applications (Flutter primary, Kotlin/Swift for platform-specific modules)

---

## Architecture Enforcement

### Clean Architecture Layers

Every mobile application must follow a layered architecture with strict dependency direction:

```
┌───────────────────────────┐
│     Presentation Layer     │  ← Widgets, Pages, ViewModels/Cubits
│     (depends on Domain)    │
├───────────────────────────┤
│       Domain Layer         │  ← Entities, Use Cases, Repository Interfaces
│       (depends on nothing) │
├───────────────────────────┤
│       Data Layer           │  ← Repository Implementations, API clients, local DB
│       (depends on Domain)  │
└───────────────────────────┘
```

### Layer Rules

| Layer | Allowed Dependencies | Contains |
|---|---|---|
| **Presentation** | Domain layer only | Widgets, pages, view models, state management (Bloc/Cubit), navigation |
| **Domain** | None (pure Dart/Kotlin/Swift) | Entities, use cases, repository interfaces, value objects |
| **Data** | Domain layer only | API clients, database helpers, DTOs, mappers, repository implementations |

### Enforcement

- Domain layer must have **zero imports** from Flutter/Android/iOS frameworks.
- Data layer must not be imported directly by Presentation — only through Domain interfaces.
- Use a linter rule or CI check to verify import boundaries.

```dart
// domain/repositories/fund_repository.dart — INTERFACE
abstract class FundRepository {
  Future<List<Fund>> getFunds({required String category});
  Future<FundDetail> getFundById(String id);
}

// data/repositories/fund_repository_impl.dart — IMPLEMENTATION
class FundRepositoryImpl implements FundRepository {
  final ApiClient _apiClient;
  final FundDao _localDao;

  FundRepositoryImpl(this._apiClient, this._localDao);

  @override
  Future<List<Fund>> getFunds({required String category}) async {
    try {
      final response = await _apiClient.get('/funds', queryParameters: {'category': category});
      final funds = (response.data as List).map((e) => FundDto.fromJson(e).toEntity()).toList();
      await _localDao.cacheFunds(funds);
      return funds;
    } catch (e) {
      return _localDao.getCachedFunds(category: category);
    }
  }
}
```

---

## Dependency Injection

### Requirement

All dependencies must be injected, never instantiated directly inside classes. Use `get_it` + `injectable` (Flutter) or Hilt (Kotlin) or Swinject (Swift).

### Registration

```dart
// injection.dart
final getIt = GetIt.instance;

void configureDependencies() {
  // Data layer
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(baseUrl: AppConfig.apiBase));
  getIt.registerLazySingleton<FundDao>(() => FundDao(getIt<AppDatabase>()));

  // Repositories
  getIt.registerLazySingleton<FundRepository>(
    () => FundRepositoryImpl(getIt<ApiClient>(), getIt<FundDao>()),
  );

  // Use cases
  getIt.registerFactory(() => GetFundsUseCase(getIt<FundRepository>()));

  // Blocs/Cubits
  getIt.registerFactory(() => FundListCubit(getIt<GetFundsUseCase>()));
}
```

### Rules

- Never use `GetIt.instance` directly in widgets. Inject via constructor or use `BlocProvider`.
- Register singletons for services, factories for use cases and blocs.
- Override registrations in tests with mock implementations.

---

## Navigation Patterns

### Declarative Routing (Flutter)

Use `go_router` for declarative, type-safe routing:

```dart
final router = GoRouter(
  initialLocation: '/dashboard',
  redirect: (context, state) {
    final isLoggedIn = getIt<AuthService>().isAuthenticated;
    if (!isLoggedIn && !state.matchedLocation.startsWith('/auth')) {
      return '/auth/login';
    }
    return null;
  },
  routes: [
    GoRoute(path: '/auth/login', builder: (_, __) => const LoginPage()),
    ShellRoute(
      builder: (_, __, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/dashboard', builder: (_, __) => const DashboardPage()),
        GoRoute(
          path: '/funds/:fundId',
          builder: (_, state) => FundDetailPage(fundId: state.pathParameters['fundId']!),
        ),
      ],
    ),
  ],
);
```

### Rules

- All route paths are defined as constants in a single file.
- Deep links must be tested and documented.
- Navigation must not break the back stack.
- Passing data between routes: use path/query parameters for IDs and simple values, use a shared service or state for complex objects.

---

## API Layer Structure

### HTTP Client Configuration

```dart
class ApiClient {
  late final Dio _dio;

  ApiClient({required String baseUrl, required TokenStorage tokenStorage}) {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Accept': 'application/json'},
    ));

    _dio.interceptors.addAll([
      AuthInterceptor(tokenStorage),
      TenantInterceptor(),
      RetryInterceptor(maxRetries: 2),
      LoggingInterceptor(),
    ]);
  }

  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) {
    return _dio.post(path, data: data);
  }
}
```

### DTO → Entity Mapping

Never expose DTOs to the domain layer. Always map:

```dart
class FundDto {
  final String schemeCode;
  final String schemeName;
  final String navValue;
  final String date;

  FundDto.fromJson(Map<String, dynamic> json)
      : schemeCode = json['scheme_code'],
        schemeName = json['scheme_name'],
        navValue = json['nav'],
        date = json['date'];

  Fund toEntity() => Fund(
    code: schemeCode,
    name: schemeName,
    nav: Decimal.parse(navValue),
    date: DateTime.parse(date),
  );
}
```

---

## Error Handling Patterns

### Typed Failures

```dart
sealed class Failure {
  final String message;
  const Failure(this.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'No internet connection']);
}

class ServerFailure extends Failure {
  final int statusCode;
  const ServerFailure(this.statusCode, [super.message = 'Server error']);
}

class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Cache read failed']);
}

class AuthFailure extends Failure {
  const AuthFailure([super.message = 'Authentication failed']);
}
```

### Result Type

```dart
import 'package:dartz/dartz.dart';

typedef Result<T> = Either<Failure, T>;

// Usage in repository
Future<Result<List<Fund>>> getFunds() async {
  try {
    final response = await _apiClient.get('/funds');
    final funds = (response.data as List).map((e) => FundDto.fromJson(e).toEntity()).toList();
    return Right(funds);
  } on DioException catch (e) {
    if (e.type == DioExceptionType.connectionError) {
      return const Left(NetworkFailure());
    }
    return Left(ServerFailure(e.response?.statusCode ?? 500));
  }
}
```

### Rules

- Never catch generic `Exception` and swallow it. Always log or propagate.
- Show user-friendly messages in the UI, log technical details.
- Distinguish between retryable and non-retryable errors.
- Network errors: show offline banner + retry button.
- Auth errors: redirect to login.
- Validation errors: show inline field errors.

---

## Testing Pyramid

### Target Ratios

```
         ┌───────┐
         │  UI   │   5%   (Playwright / Integration tests)
         │ Tests │
        ─┼───────┼─
        │ Integration│  15%  (Widget tests with mocked services)
        │   Tests    │
       ─┼────────────┼─
       │   Unit Tests  │  80%  (Use cases, repositories, utilities)
       │               │
       └───────────────┘
```

### Unit Tests

- All use cases and repository implementations must have unit tests.
- All utility functions (formatters, validators, calculators) must have unit tests.
- Mock external dependencies (API client, database, platform services).
- Test edge cases: empty data, null values, error conditions, boundary values.

### Widget Tests

- All shared components must have widget tests.
- Test rendering with different props/states (loading, data, error, empty).
- Test user interactions (tap, swipe, scroll).
- Use `mocktail` or `mockito` for mocking dependencies.

### Integration Tests

- Test critical user flows end-to-end: login, dashboard load, transaction, logout.
- Run on real devices in CI (Firebase Test Lab or BrowserStack).
- Maximum runtime: 10 minutes per flow.

---

## CI/CD Requirements

### Pipeline Stages

```yaml
# .github/workflows/mobile.yml
stages:
  - analyze:     # dart analyze, lint, formatting check
  - test:        # unit tests, widget tests
  - build:       # debug + release builds for all flavors
  - integration: # integration tests on emulator/simulator
  - deploy:      # upload to TestFlight / Play Store internal track
```

### Mandatory Checks

- [ ] `dart analyze` — zero warnings
- [ ] `dart format --set-exit-if-changed .` — consistent formatting
- [ ] All tests pass
- [ ] Code coverage ≥ 70% (fail build below threshold)
- [ ] No new `dart:mirrors` or reflection usage
- [ ] Build size within budget (see below)
- [ ] No new permissions added without approval

---

## App Size Budgets

| Platform | Target | Maximum | Action |
|---|---|---|---|
| Android (APK) | < 25 MB | 35 MB | Investigate and optimize |
| Android (AAB) | < 15 MB | 20 MB | Investigate and optimize |
| iOS (IPA) | < 40 MB | 55 MB | Investigate and optimize |

### Size Optimization Rules

- Use deferred/lazy loading for features not needed at startup.
- Compress images at build time (WebP for Android, HEIC for iOS).
- Remove unused assets, fonts, and packages regularly.
- Tree-shake icons: import only used icons from packages.
- Profile with `--analyze-size` flag.

---

## Crash-Free Rate Targets

| Metric | Target | Alert Threshold |
|---|---|---|
| Crash-free users (daily) | ≥ 99.5% | < 99.0% |
| Crash-free sessions (daily) | ≥ 99.8% | < 99.5% |
| ANR rate (Android) | < 0.5% | > 1.0% |

### Crash Monitoring

- All apps integrate Crashlytics (Firebase) or Sentry.
- Crash reports include: tenant ID, user ID, app version, device model, OS version.
- P0 crashes (affecting >1% of users) are fixed within 24 hours.
- Weekly crash review meeting with mobile team.

---

## Performance Metrics

| Metric | Target | How to Measure |
|---|---|---|
| Cold start time | < 2s | Firebase Performance |
| Screen transition | < 300ms | Flutter DevTools |
| Frame render time | < 16ms (60fps) | Flutter DevTools / Perfetto |
| API response (perceived) | < 1s | Shimmer/skeleton shown, data loaded in background |
| Memory usage (idle) | < 150 MB | Xcode Instruments / Android Profiler |
| Battery impact | < 5% per hour of active use | Device battery stats |

### Performance Rules

- Use `const` constructors wherever possible.
- Avoid `setState` on large widget trees — use granular state management.
- Never perform computation on the main isolate that takes > 16ms. Use `compute()` for heavy work.
- Image caching is mandatory — use `cached_network_image`.
- Pagination is mandatory for lists > 20 items.
- Dispose controllers, streams, and subscriptions in `dispose()`.
