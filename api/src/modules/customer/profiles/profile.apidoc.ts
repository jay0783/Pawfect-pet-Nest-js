/**
 * @apiGroup Customer Profile
 * @api {get} /customer/profile/my My profile
 * @apiName getMyProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                                                                  response
 * @apiSuccess {String}                                                                                  response.name
 * @apiSuccess {String}                                                                                  response.surname
 * @apiSuccess {String}                                                                                  response.email
 * @apiSuccess {String}                                                                                 [response.imageUrl]
 * @apiSuccess {String}                                                                                  response.phoneNumber
 * @apiSuccess {String}                                                                                  response.workPhoneNumber
 * @apiSuccess {Object}                                                                                  response.homePosition
 * @apiSuccess {Number}                                                                                  response.homePosition.lat
 * @apiSuccess {Number}                                                                                  response.homePosition.long
 * @apiSuccess {String}                                                                                  response.address
 * @apiSuccess {String}                                                                                  response.billingAddress
 * @apiSuccess {String}                                                                                  response.city
 * @apiSuccess {String}                                                                                  response.state
 * @apiSuccess {String}                                                                                  response.zipCode
 * @apiSuccess {String}                                                                                 [response.lockboxDoorCode]
 * @apiSuccess {String}                                                                                 [response.lockboxLocation]
 * @apiSuccess {String}                                                                                 [response.homeAlarmSystem]
 * @apiSuccess {String}                                                                                 [response.otherHomeAccessNotes]
 * @apiSuccess {String}                                                                                 [response.mailbox]
 * @apiSuccess {String}                                                                                 [response.otherRequests]
 * @apiSuccess {Boolean}                                                                                 response.isMailKeyProvided
 * @apiSuccess {Boolean}                                                                                 response.isSomeoneWillBeAtHome
 * @apiSuccess {Boolean}                                                                                 response.isWaterPlantsExists
 * @apiSuccess {String}                                                                                 [response.comment]
 * @apiSuccess {String[]="monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"}   response.garbages
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {get} /customer/profile/my/short My short profile
 * @apiName getMyShortProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                                                                 response
 * @apiSuccess {String}                                                                                 response.name
 * @apiSuccess {String}                                                                                 response.surname
 * @apiSuccess {Number}                                                                                 response.balance
 * @apiSuccess {String}                                                                                [response.imageUrl]
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {patch} /customer/profile/my Edit profile
 * @apiName editProfile
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                                                                                 name                      ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String}                                                                                 surname                   ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String}                                                                                 phoneNumber               ^(\+?[0-9]{10,14})$
 * @apiParam (Body) {String}                                                                                 workPhoneNumber           ^(\+?[0-9]{10,14})$
 * @apiParam (Body) {String}                                                                                 homeAddress               ^[A-Za-z0-9,.]{3,37}$
 * @apiParam (Body) {Object}                                                                                 homePosition
 * @apiParam (Body) {Number}                                                                                 homePosition.lat
 * @apiParam (Body) {Number}                                                                                 homePosition.long
 * @apiParam (Body) {String}                                                                                 billingAddress            ^[A-Za-z0-9,.]{3,37}$
 * @apiParam (Body) {String}                                                                                 city                      ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String}                                                                                 state                     ^[A-Za-z]{2,27}$
 * @apiParam (Body) {Object[]}                                                                              [emergencies]
 * @apiParam (Body) {String}                                                                                 emergencies.id
 * @apiParam (Body) {String}                                                                                 emergencies.name
 * @apiParam (Body) {String}                                                                                 emergencies.phoneNumber
 * @apiParam (Body) {String}                                                                                [lockboxDoorCode]           ^[0-9*#]{2,27}$
 * @apiParam (Body) {String}                                                                                [lockboxLocation]           ^[A-Z a-z]{2,27}$
 * @apiParam (Body) {String}                                                                                [homeAlarmSystem]           ^[A-Za-z]{2,27}$
 * @apiParam (Body) {String}                                                                                [otherHomeAccessNotes]      ^[A-Za-z]{2,37}$
 * @apiParam (Body) {String}                                                                                [otherRequestNotes]        ^[A-Za-z0-9,.!?#$%&*\(\)-_+=\/\|\\\“\”\"\‘\'\«\»\@\~\`]{2,37}$
 * @apiParam (Body) {String}                                                                                [mailbox]                   ^[A-Za-z0-9,.]{2,27}$
 * @apiParam (Body) {Boolean}                                                                               [isMailKeyProvided]
 * @apiParam (Body) {Boolean}                                                                               [isTurnLight]
 * @apiParam (Body) {Boolean}                                                                               [isSomeoneWillBeAtHome]
 * @apiParam (Body) {Boolean}                                                                               [isWaterPlantsExists]
 * @apiParam (Body) {String}                                                                                [comment]                   ^[A-Za-z,.!?#$\%\&\*\(\)-_+=\/\|\\\“\”\‘\«\»\@~\"\'\`]{2,37}$
 * @apiParam (Body) {String[]="monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"} [garbage]
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Boolean=true}                                                                               response.success
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {get} /customer/profile/emergencies Get emergencies
 * @apiName getEmergencies
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Object[]}                                                                                   response.items
 * @apiSuccess {String}                                                                                     response.items.id
 * @apiSuccess {String}                                                                                     response.items.name
 * @apiSuccess {String}                                                                                     response.items.phoneNumber
 *
 */

/**
 * @apiGroup Customer Profile
 * @api {put} /customer/profile/emergencies Add emergency
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
 * @apiGroup Customer Profile
 * @api {delete} /customer/profile/emergencies/:emergencyId Delete emergence
 * @apiName deleteEmergency
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                                              emergencyId
 *
 * @apiSuccess {Object}                                                                                     response
 * @apiSuccess {Boolean=true}                                                                               response.success
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {post} /customer/profile/password-change Change password
 * @apiName changePassword
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Body) {String}                                                                               oldPassword          ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~\"\']{4,27}$
 * @apiParam (Body) {String}                                                                               newPassword          ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“ ”‘«»@~\"\']{4,27}$
 *
 * @apiSuccess {Object}                                                                                    response
 * @apiSuccess {Boolean=true}                                                                              response.success
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {post} /customer/profile/avatar Set avatar
 * @apiName setAvatar
 *
 * @apiHeader Content-Type (multipart/form-data)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Form) {Object}                                                                              avatar
 *
 * @apiSuccess {Object}                                                                                   response
 * @apiSuccess {Boolean=true}                                                                             response.success
 *
 */


/**
 * @apiGroup Customer Profile
 * @api {get} /customer/profile/share Share with email
 * @apiName shareWithEmail
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {String}                                                                             email           ^[A-Za-z0-9,.!?#$%&*()-_+=/|\\“”‘«»@~'"]{2,27}$
 *
 * @apiSuccess {Object}                                                                                   response
 * @apiSuccess {Boolean=true}                                                                             response.success
 *
 */
