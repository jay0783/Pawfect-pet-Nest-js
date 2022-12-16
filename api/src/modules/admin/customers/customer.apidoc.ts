/**
 * @api {get} /admin/customers/:customerId Get customer profile
 * @apiGroup Admin customers
 * @apiName getCustomerProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                            customerId
 *
 * @apiSuccess {Object}                                   response
 * @apiSuccess {String}                                   response.name
 * @apiSuccess {String}                                   response.surname
 * @apiSuccess {String}                                   response.email
 * @apiSuccess {String}                                   [response.imageUrl]
 * @apiSuccess {String}                                   response.phoneNumber
 * @apiSuccess {String}                                   response.workPhoneNumber
 * @apiSuccess {Object}                                   response.emergencies
 *
 * @apiSuccess {Object}                                   response.homePosition
 * @apiSuccess {Number}                                   response.homePosition.lat
 * @apiSuccess {Number}                                   response.homePosition.long
 *
 * @apiSuccess {String}                                   response.address
 * @apiSuccess {String}                                   response.billingAddress
 * @apiSuccess {String}                                   response.city
 * @apiSuccess {String}                                   response.state
 * @apiSuccess {String}                                   response.zipCode
 * @apiSuccess {String}                                   [response.lockboxDoorCode]
 * @apiSuccess {String}                                   [response.lockboxLocation]
 * @apiSuccess {String}                                   [response.homeAlarmSystem]
 * @apiSuccess {String}                                   [response.otherHomeAccessNotes]
 * @apiSuccess {String}                                   [response.mailbox]
 * @apiSuccess {String}                                   [response.otherRequests]
 * @apiSuccess {Boolean}                                  response.isMailKeyProvided
 * @apiSuccess {Boolean}                                  response.isSomeoneWillBeAtHome
 * @apiSuccess {Boolean}                                  response.isWaterPlantsExists
 * @apiSuccess {String}                                   [response.comment]
 * @apiSuccess {String[]="monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}   response.garbages
 *
*/
