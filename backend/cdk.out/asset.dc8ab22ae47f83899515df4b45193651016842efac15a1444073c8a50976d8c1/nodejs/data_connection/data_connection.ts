import { DataSource } from "typeorm"
import { SecretsManager} from 'aws-sdk';
import { SecretsManagerConnectionError } from "../../../../layers/error/nodejs/errors/secrets-manager-connection-error";
import { City } from "../entity/City";
import { Country } from "../entity/Country"
import { State } from  "../entity/State"
import { Street } from "../entity/Street"
import { Block } from  "../entity/Block"
import { Coordinate } from  "../entity/Coordinate"
import { Lane } from "../entity/Lane"
import { Lane_direction } from "../entity/Lane_direction"
import { Lane_position } from "../entity/Lane_position"
import { Lane_collection } from "../entity/Lane_collection"
import { Segment } from "../entity/Segment"
import { Defect } from "../entity/Defect"
import { Defect_type } from "../entity/Defect_type"


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
                entities: [ Country, State, City, Street, Block, Coordinate, Lane, Lane_position, Lane_direction, Lane_collection, Segment, Defect_type, Defect ],
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