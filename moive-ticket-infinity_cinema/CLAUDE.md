# CLAUDE.md — Infiniti Cinema Backend

## Build & Run Commands

```bash
# Run (development)
./mvnw spring-boot:run

# Build JAR
./mvnw clean package -DskipTests

# Run tests
./mvnw test

# Run single test class
./mvnw test -Dtest=ClassName

# Windows wrappers
mvnw.cmd spring-boot:run
mvnw.cmd clean package -DskipTests
```

**Java version:** 21 | **Spring Boot:** 3.4.10 | **Build tool:** Maven

---

## Project Structure

```
src/main/java/com/duythuc_dh52201541/moive_ticket_infinity_cinema/
├── configuration/    # Spring beans: Security, JWT, Cloudinary, VNPay, WebConfig (CORS)
├── controller/       # REST endpoints (~15+ controllers)
├── dto/
│   ├── request/      # Inbound payloads (XxxRequest)
│   └── respone/      # Outbound payloads (XxxResponse) — NOTE: folder typo "respone"
├── entity/           # JPA entities (~20+): Movies, Users, Orders, Seats, ShowTimes…
├── enums/            # Status enums (~24): MovieStatus, OrderStatus, PaymentStatus…
├── exception/        # AppException, ErrorCode enum, GlobalExceptionHandler
├── mapper/           # MapStruct mappers (~13) for DTO ↔ Entity conversion
├── repository/       # Spring Data JPA repositories
├── service/          # Business logic (~20+ services)
└── utils/            # Utility classes

src/main/resources/
└── application.yaml  # All configuration (DB, JWT, Cloudinary, Mail, VNPay)
```

---

## Technical Context

| Item | Value |
|---|---|
| Server port | `8080` |
| Context path | `/duythuc` → base URL: `http://localhost:8080/duythuc` |
| Database | MySQL — `jdbc:mysql://localhost:3306/movie_ticket` |
| DB credentials | `root / root` (local dev) |
| DDL strategy | `update` (auto-migrates schema) |
| Default admin | `admin@gmail.com / admin` (seeded on startup) |
| JWT signer key | See `application.yaml → jwt.signerKey` |
| Mail | Gmail SMTP, port 587 (TLS) |
| Image storage | Cloudinary |
| Payment | VNPay |
| Timezone | `Asia/Ho_Chi_Minh` |

---

## Coding Guidelines

### Naming Conventions
- **Controllers:** `XxxController`
- **Services:** `XxxService`
- **Repositories:** `XxxRepository`
- **Mappers:** `XxxMapper`
- **Entities:** PascalCase, often plural (`Movies`, `Users`, `Orders`)
- **DTOs:** `XxxRequest` / `XxxResponse` (folder is misspelled `respone` — keep consistent)
- **Enums:** PascalCase (`MovieStatus`, `OrderStatus`)
- **Fields:** camelCase; IDs as `xxxId` or `id`; timestamps as `createdAt`, `updatedAt`
- **Package:** `com.duythuc_dh52201541.moive_ticket_infinity_cinema` (typo "moive" — do not fix)

### Lombok Patterns (standard in every class)
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
```
Services use `@RequiredArgsConstructor` + `@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)`.

### Key Libraries
| Library | Purpose |
|---|---|
| Spring Security + OAuth2 Resource Server | Auth/AuthZ |
| Nimbus JOSE JWT | JWT sign/verify |
| Spring Data JPA + MySQL | ORM |
| MapStruct 1.5.5 | DTO mapping |
| Lombok 1.18.30 | Boilerplate |
| Cloudinary 1.29.0 | Image upload |
| ZXing 3.5.1 | QR code |
| Spring Boot Mail | Email |

---

## Error Handling

**Unified response wrapper:**
```java
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    int code = 1000;   // 1000 = success
    String message;
    T result;
}
```

**Custom exception flow:**
```
throw new AppException(ErrorCode.XXX)
  → GlobalExceptionHandler (@ControllerAdvice)
  → ResponseEntity<ApiResponse>
```

**ErrorCode enum** (`exception/ErrorCode.java`) — single source of truth for all error codes (range 999–1054). Always add new errors here, never hardcode messages in controllers/services.

**HTTP status** is set per `ErrorCode` entry, not manually in controllers.

---

## Security

- JWT-based (`Authorization: Bearer <token>`)
- Roles: `ROLE_ADMIN`, `ROLE_USER`
- Public endpoints: `/auth/**`, `/movies/**`, `/banners/**`, `/cinemas/**`
- Admin-only: user management, movie/cinema CRUD
- BCrypt strength 10 for passwords
- CORS configured in `WebConfig`