import { ObjectId } from 'mongodb';
import DBAdapter from '@/adapters/db.adapter';
import EpsRepositoryAdapter from '@/adapters/eps_repository.adapter';
import CONTAINER from '@/adapters/container';
import { TYPES } from '@/adapters/types';
import { Eps } from '@/models/eps';

describe('EpsMongoRepository Integration Test', () => {
    let dbHandler: DBAdapter;
    let repository: EpsRepositoryAdapter;

    let results: Eps[];

    beforeAll(async () => {
        dbHandler = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
        repository = CONTAINER.get<EpsRepositoryAdapter>(TYPES.EpsRepositoryAdapter);
        await dbHandler.connect();
    });

    afterAll(async () => {
        await dbHandler.close();
    });

    describe('find_all', () => {
        it('should retrieve all EPS documents', async () => {
            results = await repository.findAll();

            // Verify total count
            expect(results).toHaveLength(19);

            // Verify all items are EPS instances
            results.forEach(eps => {
                expect(eps).toBeInstanceOf(Eps);
            });
        });

        it('should return correct EPS document structure', async () => {
            results = await repository.findAll();
            const SAMPLE_EPS = results[0];

            const EXPECTED_DATA = {
                _id: new ObjectId("67b7885ec6dcb343450c0579"),
                name: "COOSALUD EPS-S",
                "01_8000_phone": "18000515611",
                fax: "2606406, 2605354, 2602424 EXT 102",
                emails: "COOSALUDEPS@UNE.NET.CO , EGARCIA@COOSALUD.COM"
            };

            expect(SAMPLE_EPS.toObject()).toMatchObject(EXPECTED_DATA);
        });
    });
});