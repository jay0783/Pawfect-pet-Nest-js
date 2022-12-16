/**
 * @api {get} /admin/canceled-orders Get canceled orders
 * @apiGroup Admin Canceled orders
 * @apiName getCanceledOrders
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Query) {Number}                             [limit=10]
 * @apiParam (Query) {Number}                             [page=1]
 *
 *
 * @apiSuccess {Object}                                   response
 * @apiSuccess {Object[]}                                 response.items
 * @apiSuccess {Object}                                   response.items.customer
 * @apiSuccess {String}                                   response.items.customer.id
 * @apiSuccess {String}                                   response.items.customer.name
 * @apiSuccess {String}                                   response.items.customer.surname
 * @apiSuccess {String}                                   response.items.customer.phoneNumber
 * @apiSuccess {String}                                  [response.items.customer.imageUrl]
 *
 * @apiSuccess {Object}                                   response.items.order
 * @apiSuccess {String}                                   response.items.order.id
 * @apiSuccess {String}                                   response.items.order.name
 * @apiSuccess {Number}                                   response.items.order.timeFrom
 * @apiSuccess {Number}                                   response.items.order.timeTo
 * @apiSuccess {Number}                                   response.items.order.date
 * @apiSuccess {String}                                  [response.items.order.customerCancellationComment]
 *
 * @apiSuccess {Object[]}                                 response.items.pets
 * @apiSuccess {String}                                   response.items.pets.id
 * @apiSuccess {String}                                   response.items.pets.name
 * @apiSuccess {String}                                  [response.items.pets.string]
 *
 * @apiSuccess {Object}                                   response.meta
 * @apiSuccess {Number}                                   response.meta.itemCount
 * @apiSuccess {Number}                                   response.meta.totalItems
 * @apiSuccess {Number}                                   response.meta.itemsPerPage
 * @apiSuccess {Number}                                   response.meta.totalPages
 * @apiSuccess {Number}                                   response.meta.currentPage
 *
 */


/**
 * @apiGroup Admin Canceled orders
 * @api {get} /admin/canceled-orders/:orderId/refund Get refund info
 * @apiName getRefundInfo
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                             orderId
 *
 *
 * @apiSuccess {Object}                                   response
 * @apiSuccess {Number}                                   response.maxRefund
 *
 */
