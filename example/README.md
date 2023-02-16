# Example Project

```mermaid MODULE_DIAGRAM
graph BT
petData[petData]
fastify{{fastify}}
petRoutes[petRoutes]

petRoutes -->|Depends On| fastify & petData
```
