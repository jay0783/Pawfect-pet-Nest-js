/**
 * @apiGroup Customer Histories
 * @api {get} /customer/histories/my Get my history orders
 * @apiName getMyHistories
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                             [limit=10]
 * @apiParam (Query) {Number}                             [page=1]
 *
 * @apiSuccess {Object}                                                                response
 * @apiSuccess {Object[]}                                                              response.items
 * @apiSuccess {String}                                                                response.items.id
 * @apiSuccess {Number}                                                                response.items.timeFrom       millis timestamp
 * @apiSuccess {Number}                                                                response.items.timeTo         millis timestamp
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed"} response.items.status
 *
 * @apiSuccess {Object[]}                                                              response.items.pets
 * @apiSuccess {String}                                                                response.items.pets.id
 * @apiSuccess {String}                                                                response.items.pets.name
 * @apiSuccess {String}                                                               [response.items.pets.imageUrl]
 *
 * @apiSuccess {Object}                                                                response.items.service
 * @apiSuccess {String}                                                                response.items.service.id
 * @apiSuccess {String}                                                                response.items.service.title
 * @apiSuccess {String}                                                               [response.items.service.imageUrl]
 *
 * @apiSuccess {Object}                                                               [response.items.employee]
 * @apiSuccess {String}                                                                response.items.employee.id
 * @apiSuccess {String}                                                                response.items.employee.name
 * @apiSuccess {String}                                                                response.items.employee.surname
 * @apiSuccess {String}                                                               [response.items.employee.imageUrl]
 * @apiSuccess {Number}                                                                response.items.employee.rating
 * 
 * @apiSuccess {Object}                                                                response.meta
 * @apiSuccess {Number}                                                                response.meta.itemCount
 * @apiSuccess {Number}                                                                response.meta.totalItems
 * @apiSuccess {Number}                                                                response.meta.itemsPerPage
 * @apiSuccess {Number}                                                                response.meta.totalPages
 * @apiSuccess {Number}                                                                response.meta.currentPage
 *
 */


/**
 * @apiGroup Customer Histories
 * @api {get} /customer/histories/:orderId Get history order details
 * @apiName getHistoryDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                          orderId
 * 
 * 
 * @apiSuccess {Object}                                                                response
 * @apiSuccess {String}                                                                response.id
 * @apiSuccess {Object}                                                                response.timeFrom
 * @apiSuccess {Object}                                                                response.timeTo
 * @apiSuccess {Object}                                                                response.totalDuration
 * 
 * @apiSuccess {Object[]}                                                              response.pets
 * @apiSuccess {String}                                                                response.pets.id
 * @apiSuccess {String}                                                                response.pets.name
 * @apiSuccess {String}                                                               [response.pets.imageUrl]
 * 
 * @apiSuccess {Object}                                                               [response.employee]
 * @apiSuccess {String}                                                                response.employee.id
 * @apiSuccess {String}                                                                response.employee.name
 * @apiSuccess {String}                                                                response.employee.surname
 * @apiSuccess {String}                                                               [response.employee.imageUrl]
 * @apiSuccess {Number}                                                                response.employee.rating
 * 
 * @apiSuccess {Object[]}                                                              response.checklist
 * @apiSuccess {String}                                                                response.checklist.id
 * @apiSuccess {String}                                                                response.checklist.name
 * @apiSuccess {String}                                                                response.checklist.numOrder
 * @apiSuccess {String}                                                               [response.checklist.imageUrl]
 * @apiSuccess {String[]}                                                              response.checklist.attachmentUrls
 * @apiSuccess {Object[]}                                                              response.checklist.actions
 * @apiSuccess {String}                                                                response.checklist.actions.name
 * @apiSuccess {Number}                                                                response.checklist.actions.time
 *
 */