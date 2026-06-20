// tests/e2e/helpers/apiHelpers.ts
export class ApiTestHelper {
  constructor(private baseURL: string) {}

  async createTestCycle(accessToken: string, data: any) {
    const response = await fetch(`${this.baseURL}/api/cycles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async deleteCycle(cycleId: string, accessToken: string) {
    return fetch(`${this.baseURL}/api/cycles/${cycleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }
}