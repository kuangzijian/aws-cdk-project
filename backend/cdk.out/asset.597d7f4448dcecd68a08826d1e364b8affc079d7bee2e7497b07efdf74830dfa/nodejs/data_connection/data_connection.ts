import { DataSource } from "typeorm"
import { SecretsManager} from 'aws-sdk';
import { SecretsManagerConnectionError } from "../../../../layers/error/nodejs/errors/secrets-manager-connection-error";
import { Segment } from "../entity/Segment"



class Database{
    private dataSource: DataSource

    constructor() {
        this.dataSource = new DataSource({type: "mysql"})
    }
    public async getConnection(): Promise<DataSource> {
        if (!this.dataSource.isInitialized){
            // If not data sourse initiializad, we create new.
            // Grab configs from AWS secret manager
            const secretName = process.env.SECRET_ARN!.split(':').pop()!.split('-')[0];
            const secretsManager = new SecretsManager({region: 'us-west-2'})
            const params = { SecretId: secretName }
            const response = await secretsManager.getSecretValue(params).promise()
            if (response.SecretString == null) {
                throw new SecretsManagerConnectionError();
            }    
            const {
                'host': dbHost,
                'database' : dbName,
                'username' : dbUser,
                'password' : dbPw,
                'engine' : dbEngine,
                'port' : dbport
            } = JSON.parse(response.SecretString);

            //Create datasource
            this.dataSource = new DataSource({
                type: dbEngine,
                host: dbHost,
                port: dbport,
                username: dbUser,
                password:dbPw,
                database: dbName,
                synchronize: false,
                logging: false,
                entities: [ Segment ],
                migrations: [],
                subscribers: [],
            }); 
            await this.dataSource.initialize()
            console.log("Connection Successfully")
        }
        return this.dataSource
    }
}


export const database = new Database()