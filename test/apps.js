'use strict';

const {
    stub
} = require('sinon');

const {
    fetchAllAnimals,
    fetchCats,
    fetchDogs
} = require('../');

const CAT_URL = 'http://cats.something/api';
const DOG_URL = 'http://dogs.something/api';

const GOOD_CAT_RESPONSE = {
    status: 200,
    data: 'some cat data'
};

const GOOD_DOG_RESPONSE = {
    status: 200,
    data: 'some dog data'
};

const BAD_CAT_RESPONSE = {
    error: 'some cat error'
};

const BAD_DOG_RESPONSE = {
    error: 'some dog error'
};

function testAnimals(func, url, goodResponse, badResponse) {
    it('resolves when fetchUrl returns < 400', async () => {
        const fetchUrl = stub()
            .withArgs(url)
            .callsArgOnWith(1, null, goodResponse);

        await expect(func(fetchUrl))
            .resolves
            .toBe(goodResponse.data);

        expect(fetchUrl.calledWith(url)).toBeTruthy();
    });

    function testError(desc, statusCode) {
        it(`rejects when fetchUrl returns ${desc}`, async () => {
            const fetchUrl = stub()
                .withArgs(url)
                .callsArgOnWith(1, null, { ...badResponse, statusCode });

            await expect(func(fetchUrl))
                .rejects
                .toThrow(badResponse.error);

            expect(fetchUrl.calledWith(url)).toBeTruthy();
        });
    }

    testError('=== 400', 400);
    testError('> 400', 500);
}

describe('fetchCats returns a promise that', () => {
    testAnimals(fetchCats, CAT_URL, GOOD_CAT_RESPONSE, BAD_CAT_RESPONSE);
});

describe('fetchDogs returns a promise that', () => {
    testAnimals(fetchDogs, DOG_URL, GOOD_DOG_RESPONSE, BAD_DOG_RESPONSE);
});

describe('fetchAllAnimals returns a promise that', () => {
    it('resolves when fetchCats and fetchDogs resolve', async () => {
        const fetchUrl = stub();

        fetchUrl
            .withArgs(CAT_URL)
            .callsArgOnWith(1, null, GOOD_CAT_RESPONSE);

        fetchUrl
            .withArgs(DOG_URL)
            .callsArgOnWith(1, null, GOOD_DOG_RESPONSE);

        await expect(fetchAllAnimals(fetchUrl))
            .resolves
            .toMatchObject([GOOD_CAT_RESPONSE.data, GOOD_DOG_RESPONSE.data]);

        expect(fetchUrl.calledWith(CAT_URL)).toBeTruthy();
        expect(fetchUrl.calledWith(DOG_URL)).toBeTruthy();
    });

    it('rejects when fetchCats rejects', async () => {
        const fetchUrl = stub();

        fetchUrl
            .withArgs(CAT_URL)
            .callsArgOnWith(1, null, { ...BAD_CAT_RESPONSE, statusCode: 400 });

        fetchUrl
            .withArgs(DOG_URL)
            .callsArgOnWith(1, null, GOOD_DOG_RESPONSE);

        await expect(fetchAllAnimals(fetchUrl))
            .rejects
            .toThrow(BAD_CAT_RESPONSE.error);

        expect(fetchUrl.calledWith(CAT_URL)).toBeTruthy();
        expect(fetchUrl.calledWith(DOG_URL)).toBeTruthy();
    });

    it('rejects when fetchDogs rejects', async () => {
        const fetchUrl = stub();

        fetchUrl
            .withArgs(CAT_URL)
            .callsArgOnWith(1, null, GOOD_CAT_RESPONSE);

        fetchUrl
            .withArgs(DOG_URL)
            .callsArgOnWith(1, null, { ...BAD_DOG_RESPONSE, statusCode: 400 });

        await expect(fetchAllAnimals(fetchUrl))
            .rejects
            .toThrow(BAD_DOG_RESPONSE.error);

        expect(fetchUrl.calledWith(CAT_URL)).toBeTruthy();
        expect(fetchUrl.calledWith(DOG_URL)).toBeTruthy();
    });
});
