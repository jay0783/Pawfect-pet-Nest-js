/**
 * @api {get} /admin/pets/:petId Get pet profile
 * @apiGroup Admin pets
 * @apiName getPetInfo
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    petId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {String}                                           response.name
 * @apiSuccess {String="dog", "cat", "small-animal"}              response.speciesType
 * @apiSuccess {String="male", "female"}                          response.gender
 * @apiSuccess {Number}                                           [response.age]
 * @apiSuccess {String}                                           response.breed
 * @apiSuccess {String}                                           [response.imageUrl]
 * @apiSuccess {Number}                                           [response.size]
 * @apiSuccess {String="small", "medium", "large"}                [response.sizeType]
 * @apiSuccess {String}                                           [response.feedingInstructions]
 * @apiSuccess {String[]}                                         [response.onWalks]
 * @apiSuccess {String[]}                                         [response.onSomeoneEntry]
 * @apiSuccess {String}                                           [response.medicationInstructions]
 * @apiSuccess {Boolean}                                          [response.isSprayed]
 * @apiSuccess {Boolean}                                          [response.hasMedication]
 * @apiSuccess {String}                                           [response.medicalRequirements]
 * @apiSuccess {String}                                           response.medicalNotes
 *
 * @apiSuccess {Object}                                           response.veterinarian
 * @apiSuccess {String}                                           response.veterinarian.id
 * @apiSuccess {String}                                           response.veterinarian.name
 * @apiSuccess {String}                                           response.veterinarian.phoneNumber
 *
 * @apiSuccess {Boolean}                                          [response.isDoggyDoorExists]
 * @apiSuccess {String="shy", "friendly"}                         [response.character]
 * @apiSuccess {String}                                           [response.locationOfLitterbox]
 *
 * @apiSuccess {Object[]}                                         response.vaccinations
 * @apiSuccess {String}                                           response.vaccinations.id
 * @apiSuccess {String}                                           response.vaccinations.imageUrl
 */
