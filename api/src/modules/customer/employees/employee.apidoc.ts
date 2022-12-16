/**
 * @apiGroup Customer Employees
 * @api {get} /customer/employees/:employeeId Get employee profile
 * @apiName getEmployeeProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}              employeeId
 * @apiParam (Query) {String}               orderId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Object[]}                   response.items
 * @apiSuccess {String}                     response.items.id
 * @apiSuccess {String}                     response.items.name
 * @apiSuccess {String}                     response.items.surname
 * @apiSuccess {String}                    [response.items.imageUrl]
 * @apiSuccess {Number}                     response.items.rating
 * @apiSuccess {Boolean}                    response.items.wasOrderRated
 * @apiSuccess {Object[]}                   response.items.comments
 * @apiSuccess {String}                     response.items.comments.id
 * @apiSuccess {String}                     response.items.comments.name
 * @apiSuccess {String}                     response.items.comments.surname
 * @apiSuccess {String}                    [response.items.comments.imageUrl]
 * @apiSuccess {Number}                     response.items.comments.rating
 * @apiSuccess {String}                    [response.items.comments.comment]
 */


/**
 * @apiGroup Customer Employees
 * @api {post} /customer/employees/:employeeId/rate Rate employee
 * @apiName rateEmployee
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}              employeeId
 * @apiParam (Body) {String}                orderId
 * @apiParam (Body) {String}               [comment]
 * @apiParam (Body) {Number{0-5}}           rating
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Boolean=true}               response.success
 */