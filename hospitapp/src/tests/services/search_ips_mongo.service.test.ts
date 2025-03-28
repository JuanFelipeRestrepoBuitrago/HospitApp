import { Container } from 'inversify';
import { TYPES } from '@/adapters/types';
import { SearchIpsMongoService } from '@/services/search_ips/search_ips_mongo.service';
import type SearchIpsServiceAdapter from '@/adapters/search_ips.service.adapter';
import type IpsRepositoryAdapter from '@/adapters/ips_repository.adapter';
import type SpecialtyRepositoryAdapter from '@/adapters/specialty_repository.adapter';
import type EPSRepositoryAdapter from '@/adapters/eps_repository.adapter';
import { IpsResponse } from '@/models/ips.interface';

describe('SearchIpsMongoService Integration Test', () => {
    const CONTAINER = new Container();
    let service: SearchIpsMongoService;
    let mockIpsRepository: jest.Mocked<IpsRepositoryAdapter>;
    let mockSpecialtyRepository: jest.Mocked<SpecialtyRepositoryAdapter>;
    let mockEpsRepository: jest.Mocked<EPSRepositoryAdapter>;

    const TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];

    const MOCK_IPS_RES: IpsResponse = {
        _id: "67b3e98bb1ae5d9e47ae7a07",
        name: 'ESE HOSPITAL VENANCIO DIAZ DIAZ',
        department: 'ANTIOQUIA',
        town: 'SABANETA',
        address: 'KR 46B # 77 SUR 36',
        phone: 2889701,
        email: 'GERENCIA@HOSPITALSABANETA.GOV.CO',
        location: {
            type: 'Point',
            coordinates: [-75.6221158, 6.1482081]
        },
        level: 1,
        distance: 2415.089412549286
    };

    beforeAll(() => {
        // Create mock repository
        mockIpsRepository = {
            findAllByDistanceSpecialtyEps: jest.fn().mockResolvedValue({
                results: [{
                    toResponse: () => MOCK_IPS_RES
                }],
                total: 1
            }),
            findByName: jest.fn().mockResolvedValue({
                toResponse: () => MOCK_IPS_RES
            })
        };

        mockSpecialtyRepository = {
            findAll: jest.fn().mockResolvedValue([{
                toResponse: () => ({
                    _id: "67b3e98bb1ae5d9e47ae7a08",
                    name: 'ENFERMERÍA',
                })
            }])
        };

        mockEpsRepository = {
            findAll: jest.fn().mockResolvedValue([{
                toResponse: () => ({
                    _id: "67b3e98bb1ae5d9e47ae7a09",
                    name: 'SALUD TOTAL',
                })
            }])
        };

        // Rebind repository for testing
        CONTAINER.bind<IpsRepositoryAdapter>(TYPES.IpsRepositoryAdapter)
            .toConstantValue(mockIpsRepository);
        CONTAINER.bind<SpecialtyRepositoryAdapter>(TYPES.SpecialtyRepositoryAdapter)
            .toConstantValue(mockSpecialtyRepository);
        CONTAINER.bind<EPSRepositoryAdapter>(TYPES.EpsRepositoryAdapter)
            .toConstantValue(mockEpsRepository);
        CONTAINER.bind<SearchIpsServiceAdapter>(TYPES.SearchIpsServiceAdapter).to(SearchIpsMongoService)

        service = CONTAINER.get<SearchIpsMongoService>(TYPES.SearchIpsServiceAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('filter', () => {
        it('should correctly delegate to repository and return documents', async () => {
            const { results, total } = await service.filterIps(
                TEST_COORDINATES[0],
                TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify repository call
            expect(mockIpsRepository.findAllByDistanceSpecialtyEps).toHaveBeenCalledWith(
                TEST_COORDINATES[0],
                TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify output transformation
            expect(results).toEqual([MOCK_IPS_RES]);
            expect(total).toBe(1);
        });

        it('should convert all results to IPSDocument format', async () => {
            const { results } = await service.filterIps(
                TEST_COORDINATES[0],
                TEST_COORDINATES[1],
                5000,
                [],
                [],
                1,
                10
            );

            results.forEach(doc => {
                expect(doc).toMatchObject({
                    _id: expect.any(String),
                    name: expect.any(String),
                    department: expect.any(String),
                    location: {
                        type: 'Point',
                        coordinates: expect.any(Array)
                    }
                });
            });
        });

        it('should handle pagination parameters correctly', async () => {
            const { total } = await service.filterIps(
                TEST_COORDINATES[0],
                TEST_COORDINATES[1],
                5000,
                [],
                [],
                2,
                5
            );

            expect(mockIpsRepository.findAllByDistanceSpecialtyEps).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                2,
                5
            );
            expect(total).toBe(1);
        });

        it('should handle repository errors', async () => {
            mockIpsRepository.findAllByDistanceSpecialtyEps.mockRejectedValueOnce(new Error('DB error'));

            await expect(service.filterIps(
                TEST_COORDINATES[0],
                TEST_COORDINATES[1],
                5000,
                [],
                [],
                1,
                10
            )).rejects.toThrow('DB error');
        });
    });

    describe('get_specialties', () => {
        it('should retrieve and transform all specialties', async () => {
            const specialties = await service.getAllSpecialties();

            expect(mockSpecialtyRepository.findAll).toHaveBeenCalled();
            expect(specialties).toEqual([{
                _id: "67b3e98bb1ae5d9e47ae7a08",
                name: 'ENFERMERÍA',
            }]);
        });

        it('should handle empty specialty list', async () => {
            mockSpecialtyRepository.findAll.mockResolvedValueOnce([]);
            const specialties = await service.getAllSpecialties();

            expect(specialties).toEqual([]);
        });

        it('should handle repository errors', async () => {
            mockSpecialtyRepository.findAll.mockRejectedValueOnce(new Error('Specialty DB error'));
            await expect(service.getAllSpecialties()).rejects.toThrow('Specialty DB error');
        });
    });

    describe('get_eps', () => {
        it('should retrieve and transform all EPS entries', async () => {
            const epsList = await service.getAllEps();

            expect(mockEpsRepository.findAll).toHaveBeenCalled();
            expect(epsList).toEqual([{
                _id: "67b3e98bb1ae5d9e47ae7a09",
                name: 'SALUD TOTAL',
            }]);
        });

        it('should handle empty EPS list', async () => {
            mockEpsRepository.findAll.mockResolvedValueOnce([]);
            const epsList = await service.getAllEps();

            expect(epsList).toEqual([]);
        });

        it('should handle repository errors', async () => {
            mockEpsRepository.findAll.mockRejectedValueOnce(new Error('EPS DB error'));
            await expect(service.getAllEps()).rejects.toThrow('EPS DB error');
        });
    });
    
    describe('get_ips_by_name', () => {
        it('should retrieve IPS by ID and return transformed response', async () => {
            const name = 'ESE HOSPITAL VENANCIO DIAZ DIAZ';
            const result = await service.getIpsByName(name);

            expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
            expect(result).toEqual(MOCK_IPS_RES);
        });

        it('should return null if IPS is not found', async () => {
            const name = 'non_existent_name';
            mockIpsRepository.findByName.mockResolvedValueOnce(null);

            const result = await service.getIpsByName(name);

            expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
            expect(result).toBeNull();
        });

        it('should handle repository errors', async () => {
            const name = 'error_name';
            const error = new Error('DB error');
            mockIpsRepository.findByName.mockRejectedValueOnce(error);

            await expect(service.getIpsByName(name)).rejects.toThrow(error);
        });
    });
});