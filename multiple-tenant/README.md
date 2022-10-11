# NodeJS Multi-Tenant Multi-Schema Example

A quick PoC to see how sequelize can be used to connect to multiple schemas, one per tenant

Assuming you have MySQL setup on localhost with two databases, run:

1. `curl -H "tenant-id: tenant1" localhost:3000/users`
2. `curl -H "tenant-id: tenant2" localhost:3000/users`

should give results from the `users` table of separate databases

# TODOs

- [ ] Cache connection objects
- [ ] Performance test
- [ ] Try with different MySQL host as well
- [ ] Try with at least 100-200 tenants
- [ ] Clean up models initialization
