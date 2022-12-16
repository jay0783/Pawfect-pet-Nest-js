/**
 * @apiGroup Customer Services
 * @api {get} /customer/services Get services
 * @apiName getServices
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                   response
 * @apiSuccess {Object[]}                                 response.items
 * @apiSuccess {String}                                   response.items.id
 * @apiSuccess {String}                                  [response.items.imageUrl]
 * @apiSuccess {String}                                   response.items.title
 * @apiSuccess {Object[]}                                 response.items.services
 * @apiSuccess {String}                                   response.items.services.id
 * @apiSuccess {String}                                   response.items.services.title
 * @apiSuccess {String}                                   response.items.services.description
 * @apiSuccess {String[]="cat", "dog", "small-animal"}    response.items.services.speciesTypes
 * @apiSuccess {String="small", "medium", "large"}       [response.items.services.sizeType]
 * @apiSuccess {Number}                                   response.items.services.price
 * @apiSuccess {String}                                  [response.items.services.imageUrl]
 * @apiSuccess {Object}                                  [response.items.services.subcategory]
 * @apiSuccess {String}                                   response.items.services.subcategory.id
 * @apiSuccess {String}                                   response.items.services.subcategory.title
 * @apiSuccess {String}                                  [response.items.services.subcategory.imageUrl]
 *
 */


/**
 * @apiGroup Customer Services
 * @api {get} /customer/services/extras Get extra services
 * @apiName getExtraServices
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                   response
 * @apiSuccess {Object[]}                                 response.items
 * @apiSuccess {String}                                   response.items.id
 * @apiSuccess {String}                                   response.items.title
 * @apiSuccess {String}                                   response.items.description
 * @apiSuccess {String}                                   response.items.price
 * @apiSuccess {String}                                  [response.items.imageUrl]
 *
 */
