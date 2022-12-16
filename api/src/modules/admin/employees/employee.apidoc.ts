/**
 * @api {get} /admin/employees/:employeeId/short Get employee short profile
 * @apiGroup Admin employees
 * @apiName getEmployeeShortProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}              employeeId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {String}                     response.id
 * @apiSuccess {String}                     response.name
 * @apiSuccess {String}                     response.surname
 * @apiSuccess {String}                     [response.imageUrl]
 * @apiSuccess {Number}                     response.workTimeForm
 * @apiSuccess {Number}                     response.workTimeTo
 * @apiSuccess {Number}                     response.jobRate
 * @apiSuccess {String}                     response.email
 * @apiSuccess {String}                     response.phoneNumber
 * @apiSuccess {String}                     response.address
 * @apiSuccess {Number}                     response.rate
 *
 */


/**
 * @api {get} /admin/employees/:employeeId/full Get employee full profile
 * @apiGroup Admin employees
 * @apiName getEmployeeFullProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}              employeeId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {String}                     response.id
 * @apiSuccess {String}                     response.name
 * @apiSuccess {String}                     response.surname
 * @apiSuccess {String}                     [response.imageUrl]
 * @apiSuccess {Number}                     response.workTimeForm
 * @apiSuccess {Number}                     response.workTimeTo
 * @apiSuccess {Number}                     response.jobRate
 * @apiSuccess {String}                     response.email
 * @apiSuccess {String}                     response.phoneNumber
 * @apiSuccess {String}                     response.address
 * @apiSuccess {Number}                     response.rate
 * @apiSuccess {Object}                     response.emergencies
 * @apiSuccess {String}                     response.emergencies.id
 * @apiSuccess {String}                     response.emergencies.name
 * @apiSuccess {String}                     response.emergencies.phoneNumber
 * @apiSuccess {String}                     response.zipCode
 *
 */


/**
 * @api {get} /admin/employees/stats Get employee stats
 * @apiGroup Admin employees
 * @apiName getStats
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Number}                     response.available
 * @apiSuccess {Number}                     response.vacation
 * @apiSuccess {Number}                     response.sick
 * @apiSuccess {Number}                     response.unavailable
 *
 */


/**
 * @apiGroup Admin employees
 * @api {put} /admin/employees/:employeeId/emergency Add emergency
 * @apiName addEmergency
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Body) {String}                                                                                name                ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String}                                                                                phoneNumber         ^(\+?[0-9]{10,14})$
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Boolean=true}                                                                               response.success
 *
 */


/**
 * @apiGroup Admin employees
 * @api {put} /admin/employees/option-list Get employees as option-list
 * @apiName getEmployeesAsOptionList
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object[]}                                                                                   response
 * @apiSuccess {String}                                                                                     response.id
 * @apiSuccess {String}                                                                                     response.name
 * @apiSuccess {String}                                                                                     response.surname
 * @apiSuccess {Number}                                                                                     response.workTimeFrom
 * @apiSuccess {Number}                                                                                     response.workTimeTo
 * @apiSuccess {String}                                                                                    [response.imageUrl]
 *
 */


/**
 * @apiGroup Admin employees
 * @api {get} /admin/employees/top-rated Get top rated employees
 * @apiName getTopRated
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object[]}                                                                                   response
 * @apiSuccess {String}                                                                                     response.id
 * @apiSuccess {String}                                                                                     response.name
 * @apiSuccess {String}                                                                                     response.surname
 * @apiSuccess {String}                                                                                    [response.imageUrl]
 * @apiSuccess {Number}                                                                                     response.rating
 *
 */


/**
 * @apiGroup Admin employees
 * @api {get} /admin/employees/:employeeId/reviews Get employee reviews
 * @apiName getEmployeeReviews
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam  (Params) {String}                                                                             employeeId
 * @apiParam  (Query) {Number=10}                                                                          [limit]
 * @apiParam  (Query) {Number=1}                                                                           [page]
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Object[]}                                                                                   response.items
 * @apiSuccess {String}                                                                                     response.items.customerId
 * @apiSuccess {String}                                                                                     response.items.name
 * @apiSuccess {String}                                                                                     response.items.surname
 * @apiSuccess {String}                                                                                    [response.items.imageUrl]
 * @apiSuccess {Number}                                                                                     response.items.rating
 * @apiSuccess {Number}                                                                                    [response.items.comment]
 *
 * @apiSuccess {Object}                                                                                     response.meta
 * @apiSuccess {Number}                                                                                     response.meta.itemCount
 * @apiSuccess {Number}                                                                                     response.meta.totalItems
 * @apiSuccess {Number}                                                                                     response.meta.itemsPerPage
 * @apiSuccess {Number}                                                                                     response.meta.totalPages
 * @apiSuccess {Number}                                                                                     response.meta.currentPage
 */


/**
 * @apiGroup Admin employees
 * @api {get} /admin/employees/:employeeId/schedule/month Get employee month schedule
 * @apiName getMonthSchedule
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam  (Params) {String}                                                                             employeeId
 * @apiParam  (Query)  {Number}                                                                             dateFrom
 * @apiParam  (Query)  {Number}                                                                             dateTo
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Number}                                                                                     response.keyDate
 * @apiSuccess {String="available","vacation","sick leave","unavailable"}                                   response.keyDate.value
 *
 */


/**
 * @apiGroup Admin employees
 * @api {get} /admin/employees/:employeeId/schedule/day Get employee day schedule
 * @apiName getDaySchedule
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam  (Params) {String}                                                                             employeeId
 * @apiParam  (Query)  {Number}                                                                             date
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Object[]}                                                                                   response.items
 *
 * @apiSuccess {Object[]}                                                                                   response.items.pets
 * @apiSuccess {String}                                                                                     response.items.pets.id
 * @apiSuccess {String}                                                                                     response.items.pets.name
 * @apiSuccess {String}                                                                                     response.items.pets.breed
 * @apiSuccess {String}                                                                                    [response.items.pets.imageUrl]
 *
 * @apiSuccess {Object}                                                                                     response.items.employee
 * @apiSuccess {String}                                                                                     response.items.employee.id
 * @apiSuccess {String}                                                                                     response.items.employee.name
 * @apiSuccess {String}                                                                                     response.items.employee.surname
 * @apiSuccess {String}                                                                                    [response.items.employee.imageUrl]
 *
 * @apiSuccess {Object}                                                                                     response.items.customer
 * @apiSuccess {String}                                                                                     response.items.customer.id
 * @apiSuccess {String}                                                                                     response.items.customer.name
 * @apiSuccess {String}                                                                                     response.items.customer.surname
 * @apiSuccess {String}                                                                                     response.items.customer.homeAddress
 * @apiSuccess {String}                                                                                    [response.items.customer.imageUrl]
 *
 * @apiSuccess {Object}                                                                                     response.items.order
 * @apiSuccess {String}                                                                                     response.items.order.id
 * @apiSuccess {String}                                                                                     response.items.order.name
 * @apiSuccess {Number}                                                                                     response.items.order.dateFrom
 * @apiSuccess {Number}                                                                                     response.items.order.dateTime
 * @apiSuccess {String="confirmed","pending","canceled","in-progress","completed"}                          response.items.order.status
 * 
 * @apiSuccess {Object}                                                                                     response.items.service
 * @apiSuccess {String}                                                                                     response.items.service.id
 * @apiSuccess {String}                                                                                     response.items.service.title
 * @apiSuccess {String}                                                                                    [response.items.service.imageUrl]
 *
 */


/**
 * @apiGroup Admin employees
 * @api {get} /admin/employees/order/:orderId Get employees for order
 * @apiName getEmployeesForOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam  (Params) {String}                                                                             orderId
 * @apiParam  (Query)  {Number=10}                                                                         [limit]
 * @apiParam  (Query)  {Number=1}                                                                          [page]
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Object[]}                                                                                   response.items
 * @apiSuccess {String}                                                                                     response.items.id
 * @apiSuccess {String}                                                                                     response.items.name
 * @apiSuccess {String}                                                                                     response.items.surname
 * @apiSuccess {String}                                                                                    [response.items.imageUrl]
 * @apiSuccess {Number}                                                                                     response.items.workTimeFrom
 * @apiSuccess {Number}                                                                                     response.items.workTimeTo
 *
 * @apiSuccess {Object}                                                                                     response.meta
 * @apiSuccess {Number}                                                                                     response.meta.itemCount
 * @apiSuccess {Number}                                                                                     response.meta.totalItems
 * @apiSuccess {Number}                                                                                     response.meta.itemsPerPage
 * @apiSuccess {Number}                                                                                     response.meta.totalPages
 * @apiSuccess {Number}                                                                                     response.meta.currentPage
 *
 */