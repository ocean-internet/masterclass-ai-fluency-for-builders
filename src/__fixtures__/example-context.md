We need to make a decision about our database strategy for new services. The main options are to standardise on PostgreSQL, standardise on MongoDB, or allow teams to choose their own strategy.

What's driving this decision is the need to reduce team cognitive load, preserve strong ACID guarantees where required, and avoid unnecessary tool sprawl while still supporting fast delivery. At the same time, we have to deal with mixed workloads - some transaction-heavy, some document-oriented - and our teams don't all have the same level of database expertise.
