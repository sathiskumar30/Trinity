# 1) Start from official lightweight Postgres image
FROM postgres:16-alpine

# 2) Set environment variables with safe defaults (overridable)
ENV POSTGRES_DB=ideaboard \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres

# 3) Copy initialization SQL to the special entrypoint directory
#    Files in /docker-entrypoint-initdb.d/*.sql are executed on first start.
COPY init.sql /docker-entrypoint-initdb.d/

# 4) Expose default Postgres port
EXPOSE 5432

# 5) No CMD needed; inherited entrypoint launches postgres server
