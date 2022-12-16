/**
 * @apiGroup Customer Orders
 * @api {post} /customer/orders Create new MainOrder with orders
 * @apiName createOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Body) {String}                                      serviceId
 * @apiParam (Body) {String[]}                                    petIds
 * @apiParam (Body) {Number[]}                                    dates                    timestamp millis
 * @apiParam (Body) {String}                                      [comment]
 * @apiParam (Body) {String[]}                                    [extraIds]               max=86399000 min=0
 * @apiParam (Body) {Object[]}                                    visits
 * @apiParam (Body) {String="morning", "afternoon", "evening"}    visits.type
 * @apiParam (Body) {Number}                                      visits.time              max=86399000 min=0
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {Object[]}                                         response.pets
 * @apiSuccess {String}                                           response.pets.id
 * @apiSuccess {String}                                           response.pets.name
 * @apiSuccess {String}                                           [response.pets.imageUrl]
 * @apiSuccess {Object}                                           response.service
 * @apiSuccess {String}                                           response.service.id
 * @apiSuccess {String}                                           response.service.title
 * @apiSuccess {String}                                           [response.service.imageUrl]
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed", "partially-confirmed"}  response.status="pending"
 * @apiSuccess {Object[]}                                         response.visits
 * @apiSuccess {String="morning", "afternoon", "evening"}         response.visits.type
 * @apiSuccess {Number}                                           response.visits.timeFrom
 * @apiSuccess {Number}                                           response.visits.timeTo
 * @apiSuccess {Object[]}                                         response.orders
 * @apiSuccess {String}                                           response.orders.id
 * @apiSuccess {Number}                                           response.orders.dateFrom
 * @apiSuccess {Number}                                           response.orders.dateTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}  response.orders.status
 */


/**
 * @apiGroup Customer Orders
 * @api {get} /customer/orders Get Main Orders
 * @apiName getMainOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 * @apiParam (Query) {Number}                             [limit=10]
 * @apiParam (Query) {Number}                             [page=1]
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {Object[]}                                         response.items.pets
 * @apiSuccess {String}                                           response.items.pets.id
 * @apiSuccess {String}                                           response.items.pets.name
 * @apiSuccess {String}                                           [response.items.pets.imageUrl]
 * @apiSuccess {Object}                                           response.items.service
 * @apiSuccess {String}                                           response.items.service.id
 * @apiSuccess {String}                                           response.items.service.title
 * @apiSuccess {String}                                           [response.items.service.imageUrl]
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed", "partially-confirmed"}  response.items.status="pending"
 * @apiSuccess {Object[]}                                         response.items.visits
 * @apiSuccess {String="morning", "afternoon", "evening"}         response.items.visits.type
 * @apiSuccess {Number}                                           response.items.visits.timeFrom
 * @apiSuccess {Number}                                           response.items.visits.timeTo
 * @apiSuccess {Object[]}                                         response.items.orders
 * @apiSuccess {String}                                           response.items.orders.id
 * @apiSuccess {Number}                                           response.items.orders.dateFrom
 * @apiSuccess {Number}                                           response.items.orders.dateTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}  response.items.orders.status
 * 
 * @apiSuccess {Object}                                   response.meta
 * @apiSuccess {Number}                                   response.meta.itemCount
 * @apiSuccess {Number}                                   response.meta.totalItems
 * @apiSuccess {Number}                                   response.meta.itemsPerPage
 * @apiSuccess {Number}                                   response.meta.totalPages
 * @apiSuccess {Number}                                   response.meta.currentPage
 */


/**
 * @apiGroup Customer Orders
 * @api {get} /customer/orders/:mainOrderId Get Main Order Details
 * @apiName getMainOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    mainOrderId
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {Number}                                           response.firstDate
 * @apiSuccess {Number}                                           response.lastDate
 * @apiSuccess {String="pending", "confirmed", "canceled", "in-progress", "completed", "partially-confirmed"}  response.status
 * @apiSuccess {String}                                          [response.comment]
 * @apiSuccess {Object[]}                                         response.pets
 * @apiSuccess {String}                                           response.pets.id
 * @apiSuccess {String}                                           response.pets.name
 * @apiSuccess {String}                                          [response.pets.imageUrl]
 * @apiSuccess {Object}                                           response.service
 * @apiSuccess {String}                                           response.service.id
 * @apiSuccess {String}                                           response.service.title
 * @apiSuccess {String}                                          [response.service.imageUrl]
 * @apiSuccess {Object[]}                                         response.visits
 * @apiSuccess {String="morning", "afternoon", "evening"}         response.visits.type
 * @apiSuccess {Number}                                           response.visits.timeFrom
 * @apiSuccess {Number}                                           response.visits.timeTo
 * @apiSuccess {Object[]}                                         response.orders
 * @apiSuccess {String}                                           response.orders.id
 * @apiSuccess {Number}                                           response.orders.dateFrom
 * @apiSuccess {Number}                                           response.orders.dateTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}  response.orders.status
 * @apiSuccess {Object}                                           response.total
 * @apiSuccess {Number}                                           response.total.totalAmount
 * @apiSuccess {Object[]}                                         response.total.holidays
 * @apiSuccess {Number}                                           response.total.holidays.date
 * @apiSuccess {Number}                                           response.total.holidays.price
 * @apiSuccess {Object[]}                                         response.total.extras
 * @apiSuccess {String}                                           response.total.extras.name
 * @apiSuccess {Number}                                           response.total.extras.price
 *
 */


/**
 * @apiGroup Customer Orders
 * @api {post} /customer/orders/cancel Main order cancel
 * @apiName cancelMainOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Body) {String}                                      id
 * @apiParam (Body) {String}                                     [reason]
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 *
 */