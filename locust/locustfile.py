import json
import logging
import random
from faker import Faker
from locust import SequentialTaskSet, constant, events, task
from locust.contrib.fasthttp import FastHttpUser

log = logging.getLogger("performance-test")
HOST = "http://localhost:3000"
fake = Faker()


class MySequentialTaskSet(SequentialTaskSet):
    host = HOST
    wait_time = constant(0)

    def get_tenant_id(self):
        num1 = random.randint(1, 20)
        return f"tenant{num1}"

    def get_headers(self, tenantId):
        headers = {"tenant-id": tenantId, "Content-Type": "application/json"}
        return headers

    def get_new_user_and_task(self, tenantId):

        return {
            "email": tenantId,
            "taskData": [
                {
                    "task": fake.name(),
                }
            ],
        }

    def on_start(self):
        """on_start is called when a Locust start before any task is scheduled"""

        pass

    def on_stop(self):
        """on_stop is called when the TaskSet is stopping"""
        pass

    @events.test_start.add_listener
    def on_test_start(environment, **kwargs):
        print("A new test is starting")

    @task
    def to_do_task(self):
        tenantId = self.get_tenant_id()
        headers = self.get_headers(tenantId)

        try:
            payload = self.get_new_user_and_task(tenantId)
            api_payload = json.dumps(payload)

            with self.client.post(
                f"/users",
                headers=headers,
                catch_response=True,
                data=api_payload,
                name="Write Operation a new User and Task",
            ) as resp_of_api_write:

                if resp_of_api_write.status_code == 200:
                    finalEmail = f"{payload['email']}@{tenantId}.com"

                    try:
                        with self.client.get(
                            "/users",
                            headers=headers,
                            catch_response=True,
                            name="zValidation of Read after Write",
                        ) as resp_of_api_read:

                            if resp_of_api_read.status_code == 200:

                                try:
                                    users = resp_of_api_read.json()[-1]
                                    receivedEmail = users["email"]

                                    if finalEmail == receivedEmail:
                                        # Avoid too much logging in load test script as it may slow it
                                        log.info(f"SUCCESS -> Email matched")
                                    else:
                                        resp_of_api_read.failure(resp_of_api_read.text)
                                except Exception as e:
                                    resp_of_api_read.failure(resp_of_api_read.text)
                                    log.error(
                                        f"resp_of_api_read Exception occurred! details are {e}"
                                    )

                            else:
                                resp_of_api_read.failure(resp_of_api_read.text)
                                log.error(f"Get API error:{resp_of_api_read.text}")

                    except Exception as e:
                        log.error(f"Exception occurred! details are {e}")
                        log.error(f"Get API error:{resp_of_api_write.text}")

                    resp_of_api_write.success()
                    # Avoid too much logging in load test script as it may slow it

                else:
                    resp_of_api_write.failure(resp_of_api_write.text)
                    # Avoid too much logging in load test script as it may slow it
                    log.error(f"error:{resp_of_api_write.text}")

        except Exception as e:
            resp_of_api_write.failure(resp_of_api_write.text)
            log.error(f"Exception occurred! details are {e}")


class LocustClient(FastHttpUser):
    host = HOST
    tasks = [MySequentialTaskSet]
