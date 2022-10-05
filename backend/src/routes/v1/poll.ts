import { Router } from 'express';
import {
    createPoll,
    answerPoll,
    fetchPublicPoll,
    fetchPrivatePoll
} from '../../controllers/pollController';

export const router = Router();

/**
 * Create poll
 * @openapi
 * /api/poll/create:
 *  post:
 *    description: Creates a new poll from given information for specified user.
 *                  A poll consists of questions and each question has sub-questions.
 *                  The sub-questions correspond to the different choices a question has.
 *                  For now, the sub-question titles have to be unique in the poll due to how the database schema is currently set up.
 *                  Currently a test user "1eb1cfae-09e7-4456-85cd-e2edfff80544" can be set as the owner of new polls.
 *                  Descriptions are also not saved to the database currently due to the database schema.
 *                  The type properties for the poll, questions and sub-questions need to be given,
 *                  although they do nothing at the moment. The types can be set to be an empty string for example.
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          name: request
 *          schema:
 *            type: object
 *            required: true
 *            description: Information about poll to create.
 *            properties:
 *              name:
 *                type: string
 *                required: true
 *                description: Name of poll.
 *              type:
 *                type: string
 *                required: true
 *                description: Type of poll.
 *              questions:
 *                type: array
 *                required: true
 *                description: Questions of the poll.
 *                items:
 *                  type: object
 *                  properties:
 *                    title:
 *                      type: string
 *                    description:
 *                      type: string
 *                    type:
 *                      type: string
 *                    subQuestions:
 *                      type: array
 *                      required: true
 *                      description: Sub-questions (options) of the question.
 *                      items:
 *                        type: object
 *                        properties:
 *                          title:
 *                            type: string
 *                          description:
 *                            type: string
 *                          type:
 *                            type: string
 *              owner:
 *                type: object
 *                required: true
 *                description: Owner of poll.
 *                properties:
 *                  accountId:
 *                    type: string
 *                    required: true
 *                    description: Owner's account id.
 *          example:
 *            name: "Name of poll."
 *            type: ""
 *            owner:
 *              accountId: "1eb1cfae-09e7-4456-85cd-e2edfff80544"
 *            questions:
 *              - title: "Title of question."
 *                description: "Description of question."
 *                type: ""
 *                subQuestions:
 *                  - title: "Title of sub-question (question option)"
 *                    description: "Description of sub-question (question option)"
 *                    type: ""
 *    responses:
 *      200:
 *        description: Private information of the new poll that was just created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  publicId:
 *                    type: string
 *                  privateId:
 *                    type: string
 *                    format: uuid
 *                  type:
 *                    type: string
 *                  owner:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                  questions:
 *                    type: object
 *                    additionalProperties:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        title:
 *                          type: string
 *                        description:
 *                          type: string
 *                        pollId:
 *                          type: string
 *                        type:
 *                          type: string
 *                        subQuestions:
 *                          type: object
 *                          additionalProperties:
 *                            id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            description:
 *                              type: string
 *                            type:
 *                              type: string
 *              example:
 *                id: "12345"
 *                name: "Name of poll."
 *                publicId: "6dac8ce7-19ba-45de-9610-1d352b02614a"
 *                privateId: "40527383-f6ba-4dba-9317-59ac7c0a0b7f"
 *                type: ""
 *                owner:
 *                  id: "1eb1cfae-09e7-4456-85cd-e2edfff80544"
 *                questions:
 *                  "403d1c8d-be0b-44cf-a855-a15e64b537c3":
 *                    id: "403d1c8d-be0b-44cf-a855-a15e64b537c3"
 *                    title: "Title of question."
 *                    description: "Description of the question."
 *                    pollId: "12345"
 *                    type: ""
 *                    subQuestions:
 *                      "232861a3-687d-4fe2-a2bc-e04962468676":
 *                        id: "232861a3-687d-4fe2-a2bc-e04962468676"
 *                        title: "Title of question."
 *                        description: "Description of the question."
 *                        pollId: "12345"
 *                        type: ""
 */
router.post('/create', createPoll);

/**
 * Answer poll
 * @openapi
 * /api/poll/answer:
 *  post:
 *    description: Answers an option of a question of a poll with given answer. The questionId should be the id
 *                  of the question to answer. The subQuestionId property of the answer object should be the id
 *                  of the sub-question the answer is for. Sub-questions are currently synonymous with question options.
 *                  The term sub-question is used in case different kinds of sub-questions are added later.
 *    produces:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          name: request
 *          schema:
 *            type: object
 *            required: true
 *            description: Information about answer to give.
 *            properties:
 *              questionId:
 *                type: string
 *                required: true
 *                description: Id of the question to answer.
 *              publicId:
 *                type: string
 *                format: uuid
 *                required: true
 *                description: Public id of the poll to answer.
 *              answer:
 *                type: object
 *                required: true
 *                description: Answer object.
 *                properties:
 *                  subQuestionId:
 *                    type: string
 *                    required: true
 *                    description: Id of the sub-question (option of the question) to answer.
 *                  answer:
 *                    type: string
 *                    required: true
 *                    description: Answer to the question's option, true / false string.
 *          example:
 *            questionId: "403d1c8d-be0b-44cf-a855-a15e64b537c3"
 *            publicId: "1baa179c-d6bb-4f23-9e3b-d76285e23d65"
 *            answer:
 *              subQuestionId: "8198ae35-0a06-4e86-93b3-109d0f337036"
 *              answer: "true"
 *    responses:
 *      200:
 *        description: Information about the answer that was created.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  questionId:
 *                    type: string
 *                  value:
 *                    type: string
 *              example:
 *                id: "e93f46d0-662c-4030-bd3a-7ae58bcf605e"
 *                questionId: "403d1c8d-be0b-44cf-a855-a15e64b537c3"
 *                value: "true"
 *
 */
router.post('/answer', answerPoll);

/**
 * Create poll
 * @openapi
 * /api/poll/publicPoll/{publicId}:
 *  get:
 *    description: Fetches a poll's public information using a publicId of the poll.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: publicId
 *        required: true
 *        type: string
 *        format: uuid
 *        description: publicId of the poll to fetch.
 *    responses:
 *      200:
 *        description: Public information about a poll.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  publicId:
 *                    type: string
 *                    format: uuid
 *                  type:
 *                    type: string
 *                  questions:
 *                    type: object
 *                    additionalProperties:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        title:
 *                          type: string
 *                        description:
 *                          type: string
 *                        pollId:
 *                          type: string
 *                        type:
 *                          type: string
 *                        subQuestions:
 *                          type: object
 *                          additionalProperties:
 *                            id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            description:
 *                              type: string
 *                            type:
 *                              type: string
 *              example:
 *                id: "3ef8119f-cdaf-4d69-bf8e-bf0ef745cbc4"
 *                name: "Name of poll."
 *                publicId: "e19330ee-2115-4c2f-91bc-3916c621a7b9"
 *                type: ""
 *                questions:
 *                  "f9a01044-cd66-4eab-b7c6-a7071c1e9dae":
 *                    id: "f9a01044-cd66-4eab-b7c6-a7071c1e9dae"
 *                    title: "Title of question."
 *                    description: "Description of the question."
 *                    pollId: "3ef8119f-cdaf-4d69-bf8e-bf0ef745cbc4"
 *                    type: ""
 *                    subQuestions:
 *                      "d9606f3a-974d-43f8-a20a-1ecd6edc8b59":
 *                        id: "d9606f3a-974d-43f8-a20a-1ecd6edc8b59"
 *                        type: ""
 *                        title: "Title of sub-question."
 *                        description: "Description of sub-question."
 *                        pollId: "3ef8119f-cdaf-4d69-bf8e-bf0ef745cbc4"
 *
 */
router.get('/publicPoll/:publicId', fetchPublicPoll);

/**
 * Create poll
 * @openapi
 * /api/poll/privatePoll/{privateId}:
 *  get:
 *    description: Fetches a poll's private information using a privateId of the poll for the admin view.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: path
 *        name: privateId
 *        required: true
 *        type: string
 *        format: uuid
 *        description: privateId of the poll to fetch.
 *    responses:
 *      200:
 *        description: Private information about a poll.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  publicId:
 *                    type: string
 *                    format: uuid
 *                  privateId:
 *                    type: string
 *                    format: uuid
 *                  type:
 *                    type: string
 *                  questions:
 *                    type: object
 *                    additionalProperties:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        title:
 *                          type: string
 *                        description:
 *                          type: string
 *                        pollId:
 *                          type: string
 *                        type:
 *                          type: string
 *                        subQuestions:
 *                          type: object
 *                          additionalProperties:
 *                            id:
 *                              type: string
 *                            title:
 *                              type: string
 *                            description:
 *                              type: string
 *                            type:
 *                              type: string
 *                  answers:
 *                    type: object
 *                    additionalProperties:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        questionId:
 *                          type: string
 *                        value:
 *                          type: string
 *              example:
 *                id: "d250c36c-f4b8-48aa-ad49-84fee79e720f"
 *                name: "Name of poll."
 *                publicId: "91fe768a-1645-472f-aaae-184a208cd15c"
 *                privateId: "4c68018d-817b-45c3-865f-aa017d96b973"
 *                type: ""
 *                questions:
 *                  "f9a01044-cd66-4eab-b7c6-a7071c1e9dae":
 *                    id: "f9a01044-cd66-4eab-b7c6-a7071c1e9dae"
 *                    title: "Title of question."
 *                    description: "Description of the question."
 *                    pollId: "d250c36c-f4b8-48aa-ad49-84fee79e720f"
 *                    type: ""
 *                    subQuestions:
 *                      "d9606f3a-974d-43f8-a20a-1ecd6edc8b59":
 *                        id: "d9606f3a-974d-43f8-a20a-1ecd6edc8b59"
 *                        type: ""
 *                        title: "Title of sub-question."
 *                        description: "Description of sub-question."
 *                        pollId: "d250c36c-f4b8-48aa-ad49-84fee79e720f"
 *                answers:
 *                  "bc05786f-769b-4462-86ee-8740de8eb341":
 *                    id: "bc05786f-769b-4462-86ee-8740de8eb341"
 *                    questionId: "f9a01044-cd66-4eab-b7c6-a7071c1e9dae"
 *                    value: "true"
 *
 */
router.get('/privatePoll/:privateId', fetchPrivatePoll);
