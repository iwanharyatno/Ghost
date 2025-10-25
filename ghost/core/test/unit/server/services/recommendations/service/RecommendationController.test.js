"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("assert/strict"));
const service_1 = require("../../../../../../core/server/services/recommendations/service");
const sinon_1 = __importDefault(require("sinon"));
describe('RecommendationController', function () {
    let service;
    let controller;
    beforeEach(function () {
        service = {};
        controller = new service_1.RecommendationController({ service: service });
    });
    describe('read', function () {
        it('should return a recommendation', async function () {
            service.readRecommendation = async (id) => {
                return {
                    id,
                    title: 'Test',
                    description: null,
                    excerpt: null,
                    featuredImage: new URL('https://example.com/image.png'),
                    favicon: new URL('https://example.com/favicon.ico'),
                    url: new URL('https://example.com'),
                    oneClickSubscribe: false,
                    createdAt: new Date('2020-01-01T00:00:00.000Z'),
                    updatedAt: null
                };
            };
            const result = await controller.read({
                data: {},
                options: {
                    id: '1'
                },
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featured_image: 'https://example.com/image.png',
                        favicon: 'https://example.com/favicon.ico',
                        url: 'https://example.com/',
                        one_click_subscribe: false,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: null,
                        count: undefined
                    }],
                meta: undefined
            });
        });
    });
    describe('add', function () {
        it('should add a recommendation', async function () {
            service.addRecommendation = async (plain) => {
                return {
                    id: '1',
                    title: plain.title,
                    description: plain.description,
                    excerpt: plain.excerpt,
                    featuredImage: plain.featuredImage ? new URL(plain.featuredImage.toString()) : null,
                    favicon: plain.favicon ? new URL(plain.favicon.toString()) : null,
                    url: new URL(plain.url.toString()),
                    oneClickSubscribe: plain.oneClickSubscribe,
                    createdAt: new Date('2020-01-01T00:00:00.000Z'),
                    updatedAt: null
                };
            };
            const result = await controller.add({
                data: {
                    recommendations: [
                        {
                            title: 'Test',
                            description: 'My description',
                            excerpt: 'My excerpt',
                            featured_image: 'https://example.com/image.png',
                            favicon: 'https://example.com/favicon.ico',
                            url: 'https://example.com/',
                            one_click_subscribe: true
                        }
                    ]
                },
                options: {},
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: 'My description',
                        excerpt: 'My excerpt',
                        featured_image: 'https://example.com/image.png',
                        favicon: 'https://example.com/favicon.ico',
                        url: 'https://example.com/',
                        one_click_subscribe: true,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: null,
                        count: undefined
                    }],
                meta: undefined
            });
        });
        it('works with all optional fields missing', async function () {
            service.addRecommendation = async (plain) => {
                return {
                    id: '1',
                    title: plain.title,
                    description: plain.description,
                    excerpt: plain.excerpt,
                    featuredImage: plain.featuredImage ? new URL(plain.featuredImage.toString()) : null,
                    favicon: plain.favicon ? new URL(plain.favicon.toString()) : null,
                    url: new URL(plain.url.toString()),
                    oneClickSubscribe: plain.oneClickSubscribe,
                    createdAt: new Date('2020-01-01T00:00:00.000Z'),
                    updatedAt: null
                };
            };
            const result = await controller.add({
                data: {
                    recommendations: [
                        {
                            title: 'Test',
                            url: 'https://example.com/'
                        }
                    ]
                },
                options: {},
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featured_image: null,
                        favicon: null,
                        url: 'https://example.com/',
                        one_click_subscribe: false,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: null,
                        count: undefined
                    }],
                meta: undefined
            });
        });
    });
    describe('check', function () {
        it('should return url metadata', async function () {
            service.checkRecommendation = async (url) => {
                return {
                    excerpt: 'Updated excerpt',
                    url
                };
            };
            const result = await controller.check({
                data: {
                    recommendations: [
                        {
                            url: 'https://example.com/'
                        }
                    ]
                },
                options: {},
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        excerpt: 'Updated excerpt',
                        created_at: null,
                        updated_at: null,
                        description: null,
                        favicon: null,
                        featured_image: null,
                        id: null,
                        one_click_subscribe: null,
                        title: null,
                        url: 'https://example.com/',
                        count: undefined
                    }],
                meta: undefined
            });
        });
        it('should serialize undefined url', async function () {
            service.checkRecommendation = async () => {
                return {
                    excerpt: 'Updated excerpt',
                    url: undefined
                };
            };
            const result = await controller.check({
                data: {
                    recommendations: [
                        {
                            url: 'https://example.com/'
                        }
                    ]
                },
                options: {},
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        excerpt: 'Updated excerpt',
                        created_at: null,
                        updated_at: null,
                        description: null,
                        favicon: null,
                        featured_image: null,
                        id: null,
                        one_click_subscribe: null,
                        title: null,
                        url: null,
                        count: undefined
                    }],
                meta: undefined
            });
        });
    });
    describe('edit', function () {
        it('should edit a recommendation', async function () {
            service.editRecommendation = async (id, edit) => {
                return {
                    id: '1',
                    title: edit.title || 'Test',
                    description: edit.description || null,
                    excerpt: edit.excerpt || null,
                    featuredImage: edit.featuredImage ? new URL(edit.featuredImage.toString()) : null,
                    favicon: edit.favicon ? new URL(edit.favicon.toString()) : null,
                    url: edit.url ? new URL(edit.url.toString()) : new URL('https://example.com'),
                    oneClickSubscribe: edit.oneClickSubscribe || false,
                    createdAt: new Date('2020-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2020-01-01T00:00:00.000Z')
                };
            };
            const result = await controller.edit({
                data: {
                    recommendations: [
                        {
                            title: 'Test'
                        }
                    ]
                },
                options: {
                    id: '1'
                },
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featured_image: null,
                        favicon: null,
                        url: 'https://example.com/',
                        one_click_subscribe: false,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: '2020-01-01T00:00:00.000Z',
                        count: undefined
                    }],
                meta: undefined
            });
        });
        it('works with all others keys', async function () {
            service.editRecommendation = async (id, edit) => {
                return {
                    id: '1',
                    title: edit.title || 'Test',
                    description: edit.description || null,
                    excerpt: edit.excerpt || null,
                    featuredImage: edit.featuredImage ? new URL(edit.featuredImage.toString()) : null,
                    favicon: edit.favicon ? new URL(edit.favicon.toString()) : null,
                    url: edit.url ? new URL(edit.url.toString()) : new URL('https://example.com'),
                    oneClickSubscribe: edit.oneClickSubscribe || false,
                    createdAt: new Date('2020-01-01T00:00:00.000Z'),
                    updatedAt: new Date('2020-01-01T00:00:00.000Z')
                };
            };
            const result = await controller.edit({
                data: {
                    recommendations: [
                        {
                            // All execpt title
                            description: 'My description',
                            excerpt: 'My excerpt',
                            featured_image: 'https://example.com/image.png',
                            favicon: 'https://example.com/favicon.ico',
                            url: 'https://example.com/',
                            one_click_subscribe: true
                        }
                    ]
                },
                options: {
                    id: '1'
                },
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: 'My description',
                        excerpt: 'My excerpt',
                        featured_image: 'https://example.com/image.png',
                        favicon: 'https://example.com/favicon.ico',
                        url: 'https://example.com/',
                        one_click_subscribe: true,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: '2020-01-01T00:00:00.000Z',
                        count: undefined
                    }],
                meta: undefined
            });
        });
    });
    describe('destroy', function () {
        it('should delete a recommendation', async function () {
            service.deleteRecommendation = async () => {
                return;
            };
            const result = await controller.destroy({
                data: {},
                options: {
                    id: '1'
                },
                user: {}
            });
            strict_1.default.deepEqual(result, undefined);
        });
    });
    describe('browse', function () {
        beforeEach(function () {
            service.listRecommendations = async () => {
                return [
                    {
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featuredImage: new URL('https://example.com/image.png'),
                        favicon: new URL('https://example.com/favicon.ico'),
                        url: new URL('https://example.com'),
                        oneClickSubscribe: false,
                        createdAt: new Date('2020-01-01T00:00:00.000Z'),
                        updatedAt: null
                    }
                ];
            };
            service.countRecommendations = async () => {
                return 1;
            };
        });
        it('default options', async function () {
            const result = await controller.browse({
                data: {},
                options: {},
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featured_image: 'https://example.com/image.png',
                        favicon: 'https://example.com/favicon.ico',
                        url: 'https://example.com/',
                        one_click_subscribe: false,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: null,
                        count: undefined
                    }],
                meta: {
                    pagination: {
                        page: 1,
                        limit: 5,
                        pages: 1,
                        total: 1,
                        next: null,
                        prev: null
                    }
                }
            });
        });
        it('all options', async function () {
            service.listRecommendations = async () => {
                return [
                    {
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featuredImage: new URL('https://example.com/image.png'),
                        favicon: new URL('https://example.com/favicon.ico'),
                        url: new URL('https://example.com'),
                        oneClickSubscribe: false,
                        createdAt: new Date('2020-01-01T00:00:00.000Z'),
                        updatedAt: null
                    }
                ];
            };
            service.countRecommendations = async () => {
                return 11;
            };
            const result = await controller.browse({
                data: {},
                options: {
                    page: 2,
                    limit: 5,
                    filter: 'id:2'
                },
                user: {}
            });
            strict_1.default.deepEqual(result, {
                data: [{
                        id: '1',
                        title: 'Test',
                        description: null,
                        excerpt: null,
                        featured_image: 'https://example.com/image.png',
                        favicon: 'https://example.com/favicon.ico',
                        url: 'https://example.com/',
                        one_click_subscribe: false,
                        created_at: '2020-01-01T00:00:00.000Z',
                        updated_at: null,
                        count: undefined
                    }],
                meta: {
                    pagination: {
                        page: 2,
                        limit: 5,
                        pages: 3,
                        total: 11,
                        next: 3,
                        prev: 1
                    }
                }
            });
        });
        describe('order', function () {
            let listSpy;
            beforeEach(function () {
                listSpy = sinon_1.default.spy(service, 'listRecommendations');
            });
            it('orders by createdAt by default', async function () {
                await controller.browse({
                    data: {},
                    options: {
                        order: ''
                    },
                    user: {}
                });
                (0, strict_1.default)(listSpy.calledOnce);
                const args = listSpy.getCall(0).args[0];
                strict_1.default.deepEqual(args.order, [
                    {
                        field: 'createdAt',
                        direction: 'desc'
                    }
                ]);
            });
            it('order by custom field', async function () {
                await controller.browse({
                    data: {},
                    options: {
                        order: 'created_at'
                    },
                    user: {}
                });
                (0, strict_1.default)(listSpy.calledOnce);
                const args = listSpy.getCall(0).args[0];
                strict_1.default.deepEqual(args.order, [
                    {
                        field: 'createdAt',
                        direction: 'desc'
                    }
                ]);
            });
            it('order by multiple custom field', async function () {
                await controller.browse({
                    data: {},
                    options: {
                        order: 'created_at, count.clicks'
                    },
                    user: {}
                });
                (0, strict_1.default)(listSpy.calledOnce);
                const args = listSpy.getCall(0).args[0];
                strict_1.default.deepEqual(args.order, [
                    {
                        field: 'createdAt',
                        direction: 'desc'
                    },
                    {
                        field: 'clickCount',
                        direction: 'desc'
                    }
                ]);
            });
            it('order by multiple custom field with directions', async function () {
                await controller.browse({
                    data: {},
                    options: {
                        order: 'created_at asc, count.clicks desc'
                    },
                    user: {}
                });
                (0, strict_1.default)(listSpy.calledOnce);
                const args = listSpy.getCall(0).args[0];
                strict_1.default.deepEqual(args.order, [
                    {
                        field: 'createdAt',
                        direction: 'asc'
                    },
                    {
                        field: 'clickCount',
                        direction: 'desc'
                    }
                ]);
            });
            it('cannot order by invalid fields', async function () {
                await strict_1.default.rejects(controller.browse({
                    data: {},
                    options: {
                        order: 'invalid desc'
                    },
                    user: {}
                }), {
                    message: 'order.0.field must be one of title, description, excerpt, one_click_subscribe, created_at, updated_at, count.clicks, count.subscribers'
                });
            });
            it('cannot order by invalid direction', async function () {
                await strict_1.default.rejects(controller.browse({
                    data: {},
                    options: {
                        order: 'created_at down'
                    },
                    user: {}
                }), {
                    message: 'order.0.direction must be one of asc, desc'
                });
            });
        });
        describe('include', function () {
            let listSpy;
            let rec = {
                id: '1',
                title: 'Test',
                description: null,
                excerpt: null,
                featuredImage: new URL('https://example.com/image.png'),
                favicon: new URL('https://example.com/favicon.ico'),
                url: new URL('https://example.com'),
                oneClickSubscribe: false,
                createdAt: new Date('2020-01-01T00:00:00.000Z'),
                updatedAt: null,
                clickCount: 5,
                subscriberCount: 10
            };
            beforeEach(function () {
                service.listRecommendations = async () => {
                    return [
                        rec
                    ];
                };
                listSpy = sinon_1.default.spy(service, 'listRecommendations');
            });
            it('can include clicks and subscribes', async function () {
                await controller.browse({
                    data: {},
                    options: {
                        withRelated: ['count.clicks', 'count.subscribers']
                    },
                    user: {}
                });
                (0, strict_1.default)(listSpy.calledOnce);
                const args = listSpy.getCall(0).args[0];
                strict_1.default.deepEqual(args.include, ['clickCount', 'subscriberCount']);
            });
            it('throws for invalid include', async function () {
                await strict_1.default.rejects(controller.browse({
                    data: {},
                    options: {
                        withRelated: ['invalid']
                    },
                    user: {}
                }), {
                    message: 'withRelated.0 must be one of count.clicks, count.subscribers'
                });
            });
        });
    });
    describe('trackClicked', function () {
        it('should track a click', async function () {
            service.trackClicked = async ({ id, memberId }) => {
                strict_1.default.equal(id, '1');
                strict_1.default.equal(memberId, undefined);
                return;
            };
            const result = await controller.trackClicked({
                data: {},
                options: {
                    id: '1',
                    context: {}
                },
                user: {}
            });
            strict_1.default.deepEqual(result, undefined);
        });
        it('authenticated', async function () {
            service.trackClicked = async ({ id, memberId }) => {
                strict_1.default.equal(id, '1');
                strict_1.default.equal(memberId, '1');
                return;
            };
            const result = await controller.trackClicked({
                data: {},
                options: {
                    id: '1',
                    context: {
                        member: {
                            id: '1'
                        }
                    }
                },
                user: {}
            });
            strict_1.default.deepEqual(result, undefined);
        });
        it('throws if invalid member context', async function () {
            await strict_1.default.rejects(async () => {
                await controller.trackClicked({
                    data: {},
                    options: {
                        id: '1',
                        context: {
                            member: {
                                missingId: 'example'
                            }
                        }
                    },
                    user: {}
                });
            }, {
                message: 'context.member.id is required'
            });
        });
    });
    describe('trackSubscribed', function () {
        it('works if authenticated', async function () {
            service.trackSubscribed = async () => {
                return;
            };
            const result = await controller.trackSubscribed({
                data: {},
                options: {
                    id: '1',
                    context: {
                        member: {
                            id: '1'
                        }
                    }
                },
                user: {}
            });
            strict_1.default.deepEqual(result, undefined);
        });
        it('throws if not authenticated', async function () {
            service.trackSubscribed = async () => {
                return;
            };
            await strict_1.default.rejects(async () => {
                await controller.trackSubscribed({
                    data: {},
                    options: {
                        id: '1',
                        context: {}
                    },
                    user: {}
                });
            }, {
                message: 'Member not found'
            }, 'trackSubscribed should throw if not authenticated');
        });
    });
});
