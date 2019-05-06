import { Client, QueryResult } from 'pg'

/**
 * A simple wrapper around the node-pg Client Object
 * that simplify certain operaitons. Beware that for the most part, it just forwards 
 * all inputs without taking any measures to even sanitize any input!
 */
export class DbHelper {
    readonly client: Client
    constructor() {
        this.client = new Client()
    }

    public connect(): Promise<void> {
        return this.client.connect()
    }

    public disconnect(): Promise<void> {
        return this.client.end()
    }

    public query(query: any): Promise<QueryResult> {
        return this.client.query(query);
    }

    public beginTransaction(): Promise<any> {
        return this.query('BEGIN')
    }

    public rollbackTransaction(): Promise<any> {
        return this.query('ROLLBACK')
    }

    public commitTransaction(): Promise<any> {
        return this.query('COMMIT')
    }
}