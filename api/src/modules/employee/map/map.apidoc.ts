/**
 * @api {get} /employee/map  Get map order list
 * @apiGroup Employee maps
 * @apiName getMapOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {Object[]}                                                                     response.items
 * @apiSuccess {String}                                                                       response.items.id
 * @apiSuccess {Number}                                                                       response.items.mainOrderFirstDate
 * @apiSuccess {Number}                                                                       response.items.mainOrderLastDate
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}        response.items.status
 * @apiSuccess {Boolean}                                                                      response.items.isFirstMeet
 * @apiSuccess {Number}                                                                       response.items.dateFrom
 * @apiSuccess {Number}                                                                       response.items.dateTo
 *
 * @apiSuccess {Object[]}                                                                     response.items.pets
 * @apiSuccess {String}                                                                       response.items.pets.id
 * @apiSuccess {String}                                                                       response.items.pets.name
 * @apiSuccess {String}                                                                       response.items.pets.breed
 * @apiSuccess {String}                                                                      [response.items.pets.imageUrl]
 *
 * @apiSuccess {Object}                                                                       response.items.service
 * @apiSuccess {String}                                                                       response.items.service.id
 * @apiSuccess {String}                                                                       response.items.service.title
 * @apiSuccess {String}                                                                      [response.items.service.imageUrl]
 *
 * @apiSuccess {Object}                                                                       response.meta
 * @apiSuccess {Number}                                                                       response.meta.itemCount
 * @apiSuccess {Number}                                                                       response.meta.totalItems
 * @apiSuccess {Number}                                                                       response.meta.itemsPerPage
 * @apiSuccess {Number}                                                                       response.meta.totalPages
 * @apiSuccess {Number}                                                                       response.meta.currentPage
 *
 */



/**
 * @api {get} /employee/map/:orderId  Get map order details
 * @apiGroup Employee maps
 * @apiName getMapOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 *
 * @apiSuccess {Object}                                                                         response
 * @apiSuccess {String}                                                                         response.id
 * @apiSuccess {String}                                                                         response.homeAddress
 *
 * @apiSuccess {Object}                                                                         response.customerHomePosition
 * @apiSuccess {Number}                                                                         response.customerHomePosition.lat
 * @apiSuccess {Number}                                                                         response.customerHomePosition.long
 *
 * @apiSuccess {Object[]}                                                                       response.pets
 * @apiSuccess {String}                                                                         response.pets.id
 * @apiSuccess {String}                                                                         response.pets.name
 * @apiSuccess {String}                                                                         response.pets.breed
 * @apiSuccess {String}                                                                        [response.pets.imageUrl]
 *
 * @apiSuccess {Object}                                                                         response.employee
 * @apiSuccess {String}                                                                         response.employee.id
 * @apiSuccess {String}                                                                         response.employee.name
 * @apiSuccess {String}                                                                         response.employee.surname
 * @apiSuccess {String}                                                                        [response.employee.imageUrl]
 * @apiSuccess {Number{0-5}}                                                                    response.employee.rating
 *
 * @apiSuccess {Object[]}                                                                       response.checklist
 * @apiSuccess {String}                                                                         response.checklist.id
 * @apiSuccess {String}                                                                         response.checklist.name
 * @apiSuccess {Number}                                                                         response.checklist.numOrder
 * @apiSuccess {Number}                                                                        [response.checklist.dateStart]
 * @apiSuccess {Number}                                                                        [response.checklist.dateEnd]
 * @apiSuccess {String}                                                                        [response.checklist.imageUrl]
 * @apiSuccess {Number}                                                                         response.checklist.duration
 * @apiSuccess {Number}                                                                         response.checklist.trackDuration
 * @apiSuccess {String[]}                                                                       response.checklist.attachmentUrls
 * @apiSuccess {Object[]}                                                                       response.checklist.actions
 * @apiSuccess {String}                                                                         response.checklist.actions.name
 * @apiSuccess {Number}                                                                         response.checklist.actions.time
 *
 * @apiSuccess {Object[]}                                                                       response.points
 * @apiSuccess {Number}                                                                         response.points.createdAt
 * @apiSuccess {Number}                                                                         response.points.lat
 * @apiSuccess {Number}                                                                         response.points.long
 *
 * @apiSuccess {Object[]}                                                                       response.actionPoints
 * @apiSuccess {Number}                                                                         response.actionPoints.createdAt
 * @apiSuccess {Number}                                                                         response.actionPoints.lat
 * @apiSuccess {Number}                                                                         response.actionPoints.long
 * @apiSuccess {String}                                                                         response.actionPoints.name
 *
 */


/**
 * @api {post} /employee/map/:orderId/next  To next stage
 * @apiGroup Employee maps
 * @apiName toNextStage
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {Boolean}                                                                 response.success
 *
 */


/**
 * @api {post} /employee/map/:orderId/position  Save position
 * @apiGroup Employee maps
 * @apiName savePosition
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 *
 * @apiParam (Body)   {Object[]}                                                                positions
 * @apiParam (Body)   {Number}                                                                  positions.lat
 * @apiParam (Body)   {Number}                                                                  positions.long
 * @apiParam (Body)   {Number}                                                                  positions.createdAt       timestamp in ms
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {Boolean}                                                                 response.success
 *
 */



/**
 * @api {post} /employee/map/:orderId/action  Save action
 * @apiGroup Employee maps
 * @apiName savePosition
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 *
 * @apiParam (Body)   {Number}                                                                  lat
 * @apiParam (Body)   {Number}                                                                  long
 * @apiParam (Body)   {String}                                                                  name
 * @apiParam (Body)   {Number}                                                                  createdAt       timestamp in ms
 * @apiParam (Body)   {String}                                                                  orderCheckId
 *
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {Boolean}                                                                 response.success
 *
 */



/**
 * @api {post} /employee/map/:orderId/time  Save tracked time
 * @apiGroup Employee maps
 * @apiName saveTrackedTime
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 * @apiParam (Body)   {String}                                                                  orderCheckId
 * @apiParam (Body)   {Number}                                                                  minutes
 *
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {Boolean}                                                                 response.success
 *
 */


/**
 * @api {post} /employee/map/:orderId/attachment  Attach photo
 * @apiGroup Employee maps
 * @apiName saveTrackedTime
 *
 * @apiHeader Content-Type (multipart/form-data)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 * @apiParam (Form)   {String}                                                                  orderCheckId
 * @apiParam (Form)   {Object}                                                                  attachment
 *
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {String}                                                                  response.url
 *
 */


/**
 * @api {post} /employee/map/:orderId/finish  Finish order
 * @apiGroup Employee maps
 * @apiName finishOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                                  orderId
 *
 *
 * @apiSuccess        {Object}                                                                  response
 * @apiSuccess        {Boolean=true}                                                            response.success
 *
 */