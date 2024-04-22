FROM postgres:16-alpine

RUN ["mkdir", "/var/log/postgresql"]
RUN ["chown", "postgres:postgres", "/var/log/postgresql"]

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_directory=/var/log/postgresql", "-c", "log_filename=postgresql.log", "-c", "log_statement=all"]