# Push Notification System

This project is a NestJS application that demonstrates how to send push notifications immediately or at a scheduled time using Bull (a Redis-backed queue system). In this example, push notifications are simulated by logging messages to the console. The app also includes Swagger documentation and a Bull Board UI for monitoring jobs.

---

## Table of Contents

- [Installation](#installation)
- [API Testing Guidelines](#api-testing-guidelines)
- [Explanation of Scheduling Logic](#explanation-of-scheduling-logic)
- [Accessing the Admin UIs](#accessing-the-admin-uis)
- [License](#license)

---

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **pnpm** (preferred for dependency management)
- **Redis** (local installation or via Docker)

### Running Redis

You can run Redis using one of the following methods:

```bash
# Option 1: Using redis-server (installed locally)
redis-server

# Option 2: Using Docker
docker run --name push-redis -p 6379:6379 -d redis
```

### Clone and Install Dependencies

```bash
git clone https://github.com/FahimWayez/push-notification-system.git
cd push-notification-system
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory and add the following content:

```env
PORT=5001
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Starting the Application

Start the app in development mode using:

```bash
pnpm start:dev
```

The server will run on [http://localhost:5001](http://localhost:5001).

---

## API Testing Guidelines

You can test the API endpoints using tools like Postman, cURL, or the interactive Swagger UI.

### 1. Send Notification Immediately

- **Endpoint:** `POST /push/send-now`
- **Request Body Example:**

```json
{
  "title": "Immediate Promo",
  "message": "Get 15% OFF right now!"
}
```

- **Expected Behavior:**
  - The API immediately logs push notifications for each user.
  - Check the console to verify that every user's name and device token are logged along with the push message.

---

### 2. Schedule Notification

- **Endpoint:** `POST /push/schedule`
- **Request Body Example:**

```json
{
  "title": "Promo Alert",
  "message": "Get 20% OFF!",
  "scheduleAt": "2025-04-11T20:53:00.000Z"
}
```

- **Expected Behavior:**
  - The API calculates the delay based on the `scheduleAt` timestamp.
  - If the scheduled time is in the future, the job is queued in Bull with a delay.
  - When the scheduled time is reached, the push notification (simulated by a console log) is executed.
  - You can check the console logs as well as the Bull Board UI to track job progress.

### Testing via Swagger

After starting the application, visit [http://localhost:5001/api](http://localhost:5001/api) from your browser for interactive API documentation and testing.

---

## Explanation of Scheduling Logic

The scheduling logic in this application works as follows:

1. **Payload Validation:**

   - The `PushNotificationDto` validates that `title` and `message` are provided, and that `scheduleAt`, if provided, is a valid ISO8601 timestamp.

2. **Time Calculation:**

   - Upon receiving a request on the `/push/schedule` endpoint, the app parses the `scheduleAt` timestamp into a Date object.
   - It then calculates the difference (in milliseconds) between the scheduled time and the current time.

3. **Decision Process:**

   - **Immediate Execution:**  
     If no `scheduleAt` is provided or if the scheduled time is in the past, the notification is sent immediately by invoking the `sendNow()` method.
   - **Delayed Execution:**  
     If the scheduled time is in the future, the notification payload is added to the Bull queue (`pushQueue`) with a delay corresponding to the calculated time difference:
     ```ts
     this.pushQueue.add('scheduled-push', payload, { delay: diff });
     ```

4. **Job Processing:**

   - A Bull processor listens for jobs with the name `'scheduled-push'`.
   - When the delay expires, Bull promotes the job and executes it. The processor then simulates sending the push notification by logging a message for each user.

5. **Monitoring:**
   - You can monitor job status (queued, active, completed, etc.) via the Bull Board admin UI.

---

## Accessing the Admin UIs

- **Swagger Documentation:**  
  Access the interactive API docs at [http://localhost:5001/api](http://localhost:5001/api).

- **Bull Board Admin UI:**  
  Monitor your Bull queue at [http://localhost:5001/admin/queues](http://localhost:5001/admin/queues).

---

## License

This project is licensed under the MIT License.