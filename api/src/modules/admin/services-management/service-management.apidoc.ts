/**
 * @api {get} /admin/services/:serviceId Get service details
 * @apiGroup Admin Services
 * @apiName getServiceDetails
 * @apiDescription Get service details
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    serviceId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {String}                                           response.title
 * @apiSuccess {Number}                                           response.price
 * @apiSuccess {String[]="cat", "dog", "small-animal"}            response.forSpeciesTypes
 * @apiSuccess {String}                                           response.description
 *
 * @apiSuccess {Object[]}                                         response.checklist
 * @apiSuccess {String}                                           response.checklist.id
 * @apiSuccess {String}                                           response.checklist.name
 * @apiSuccess {Number}                                           response.checklist.duration   In minutes
 * @apiSuccess {Boolean}                                          response.checklist.blocked
 * @apiSuccess {Number}                                           response.checklist.numOrder
 */


/**
 * @api {get} /admin/services Get all services
 * @apiGroup Admin Services
 * @apiName getAllServices
 * @apiDescription Get all services
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.name
 * @apiSuccess {String}                                          [response.imageUrl]
 *
 * @apiSuccess {Object[]}                                         response.services
 * @apiSuccess {String}                                           response.services.id
 * @apiSuccess {String}                                           response.services.title
 * @apiSuccess {Number}                                           response.services.duration   In minutes
 * @apiSuccess {Number}                                           response.services.price
 * @apiSuccess {String[]="cat", "dog", "small-animal"}            response.services.speciesType
 * @apiSuccess {String="small",  "medium", "large"}               response.services.forSizeType
 * @apiSuccess {Object}                                          [response.services.subcategory]
 * @apiSuccess {String}                                           response.services.subcategory.name
 * @apiSuccess {String}                                          [response.services.subcategory.imageUrl]
 * @apiSuccess {String[]}                                         response.services.checklist
 */


/**
 * @api {patch} /admin/services/:serviceId Update service
 * @apiGroup Admin Services
 * @apiName updateService
 * @apiDescription Update service
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                                      title                 max-25
 * @apiParam (Body) {Number}                                      price                 min-0
 * @apiParam (Body) {String[]="cat", "dog", "small-animal"}       forSpeciesTypes
 * @apiParam (Body) {String}                                      description           max-200
 * @apiParam (Body) {String[]}                                    deleteChecklistIds
 *
 * @apiParam (Body) {Object[]}                                    checklist
 * @apiParam (Body) {String}                                      checklist.id
 * @apiParam (Body) {String}                                      checklist.name        ^[A-Za-z0-9 ]{1,30}$
 * @apiParam (Body) {Number}                                      checklist.duration    In minutes
 * @apiParam (Body) {Number}                                      checklist.numOrder    min-0
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 */
