#!/bin/bash
export PGPASSWORD=postgres
./removedb.sh
psql -U postgres -f createDB.sql
psql -U postgres -f createTables.sql
psql -U postgres -f importValues.sql