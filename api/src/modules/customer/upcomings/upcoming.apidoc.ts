/**
 * @apiGroup Customer Upcoming orders
 * @api {get} /customer/upcomings Upcoming orders
 * @apiName getUpcomingOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                             [limit=10]
 * @apiParam (Query) {Number}                             [page=1]
 *
 * @apiParam (Query) {Number}                                     date                        timestamp
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {Boolean}                                          response.items.isFirstMeet
 * @apiSuccess {Number}                                           response.items.dateFrom     timestamp
 * @apiSuccess {Number}                                           response.items.dateTo       timestamp
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed"} response.items.status
 *
 * @apiSuccess {Object[]}                                         response.items.pets
 * @apiSuccess {String}                                           response.items.pets.id
 * @apiSuccess {String}                                           response.items.pets.name
 * @apiSuccess {String}                                          [response.items.pets.imageUrl]
 *
 * @apiSuccess {Object}                                          response.items.service
 * @apiSuccess {String}                                          response.items.service.id
 * @apiSuccess {String}                                          response.items.service.title
 * @apiSuccess {String}                                         [response.items.service.imageUrl]
 *
 * @apiSuccess {Object}                                         [response.items.employee]
 * @apiSuccess {String}                                          response.items.employee.id
 * @apiSuccess {String}                                          response.items.employee.name
 * @apiSuccess {String}                                          response.items.employee.surname
 * @apiSuccess {Number}                                          response.items.employee.rating     min-0 max-5
 * @apiSuccess {String}                                         [response.items.employee.imageUrl]
 * 
 * @apiSuccess {Object}                                   response.meta
 * @apiSuccess {Number}                                   response.meta.itemCount
 * @apiSuccess {Number}                                   response.meta.totalItems
 * @apiSuccess {Number}                                   response.meta.itemsPerPage
 * @apiSuccess {Number}                                   response.meta.totalPages
 * @apiSuccess {Number}                                   response.meta.currentPage
 */


/**
 * @apiGroup Customer Upcoming orders
 * @api {get} /customer/upcomings/:orderId Upcoming order details
 * @apiName getUpcomingOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    orderId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {Number}                                           response.dateFrom     timestamp
 * @apiSuccess {Number}                                           response.dateTo       timestamp
 * @apiSuccess {String}                                          [response.comment]
 * @apiSuccess {Number}                                           response.totalAmount
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed"} response.status
 *
 * @apiSuccess {Object[]}                                         response.pets
 * @apiSuccess {String}                                           response.pets.id
 * @apiSuccess {String}                                           response.pets.name
 * @apiSuccess {String}                                          [response.pets.imageUrl]
 *
 * @apiSuccess {Object}                                          response.service
 * @apiSuccess {String}                                          response.service.id
 * @apiSuccess {String}                                          response.service.title
 * @apiSuccess {String}                                         [response.service.imageUrl]
 */
