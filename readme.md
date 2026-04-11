# Omni-Market: Real-Time Auction System

Omni-Market is a distributed microservices platform designed for high-speed, real-time bidding. It leverages a modern tech stack to ensure low latency, data persistence, and a seamless user experience across multiple services.

## 🏗 System Architecture

The project is organized as a **Mono-repo** containing three primary services:

1.  **Identity & Catalog Gateway (.NET):** Manages user authentication (via Supabase Auth) and product listings.
2.  **Bidding Engine (Spring Boot):** A reactive microservice using WebFlux and WebSockets to handle live bids and broadcast updates instantly.
3.  **Real-Time Dashboard (Angular):** A responsive frontend that provides a live view of auctions and allows users to place bids.

## 🛠 Tech Stack

### Backend (Bidding Engine)
* **Framework:** Spring Boot 3 (WebFlux).
* **Real-Time:** WebSockets for full-duplex communication.
* **Database:** Supabase (PostgreSQL) with R2DBC for reactive persistence.
* **Caching:** Redis for high-speed bid tracking.
* **JSON Handling:** Jackson for efficient data serialization.

### Backend (Gateway)
* **Framework:** .NET 8.
* **Auth:** Supabase Auth integration.

### Frontend
* **Framework:** Angular 17+.
* **State Management:** RxJS for handling real-time WebSocket streams.

---

## 🚀 Getting Started

### Prerequisites
* **Java 21** and **Maven** (for Bidding Engine).
* **Node.js & npm** (for Angular).
* **.NET SDK** (for Gateway).
* **Docker Desktop** (for Redis).

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Paaku1/omni-market.git](https://github.com/Paaku1/omni-market.git)
    cd omni-market
    ```

2.  **Start Infrastructure:**
    Use Docker to spin up the necessary cache layers:
    ```bash
    docker-compose up -d
    ```

3.  **Configure Bidding Engine:**
    Update `bidding-engine-spring/src/main/resources/application.properties` with your Supabase R2DBC credentials. **Note:** Use the Transaction Pooler on port `6543`.

4.  **Run the Services:**

    * **Spring Boot:**
        ```bash
        cd bidding-engine-spring
        mvn spring-boot:run
        ```
    * **Angular:**
        ```bash
        cd frontend-angular
        npm install
        ng serve
        ```

## 📡 WebSocket API

The Bidding Engine exposes a WebSocket endpoint for live updates:
* **URL:** `ws://localhost:8080/ws/bids`
* **Message Format:**
    ```json
    {
      "auctionId": "uuid",
      "bidderId": "uuid",
      "amount": 250.00
    }
    ```

## 📂 Project Structure

```text
omni-market/
├── bidding-engine-spring/   # Java WebFlux & WebSockets
├── gateway-dotnet/          # .NET Identity & Product API
├── frontend-angular/        # Angular Dashboard
├── docker-compose.yml       # Infrastructure (Redis)
└── .gitignore               # Multi-stack ignore rules