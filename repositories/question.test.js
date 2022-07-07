const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo
  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe("Tests from task:", () => {
    test('should return a list of 0 questions', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {
      const testQuestions = [
        {
          id: faker.datatype.uuid(),
          summary: 'What is my name?',
          author: 'Jack London',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        }
      ]

      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe("Testing dummy sample for GET requests:", () => {
    const id = faker.datatype.uuid();
    const idEmptyCell = faker.datatype.uuid();
    beforeEach(async () => {
      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: [{
            id,
            summary: 'Who?',
            author: 'Tim'
          },{
            id: faker.datatype.uuid(),
            summary: 'Where?',
            author: 'Jemmy'
          },{
            id: faker.datatype.uuid(),
            summary: 'When?',
            author: 'Derek'
          }]
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        },
        {
          id: faker.datatype.uuid(),
          summary: 'Who are you?',
          author: 'Tim Doods',
          answers: []
        },
        {
          id: idEmptyCell,
          summary: '',
          author: 'Tim Doods',
          answers: []
        }
      ]
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    })
    
    test('getQuestions: should return array of size 4', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(4)
    })

    test('getQuestionById: should return one question with that id', async () => {
      expect(await questionRepo.getQuestionById(id)).toHaveLength(1);
    })

    test(`getQuestionById: should return exact id: ${id}`, async () => {
      const question = await questionRepo.getQuestionById(id)
      expect(question[0].id).toEqual(id);
    })

    test(`getQuestionById: shouldn't return any data with not existing id`, async () => {
      const question = await questionRepo.getQuestionById("12313")
      expect(question).toHaveLength(0);
    })

    test(`getQuestionById: should throw an error cause input id format has not expected`, async () => {
      expect(await questionRepo.getQuestionById("id")).toThrow('wrong input');
    })

    test('getAnswers: should return three answers', async () => {
      expect(await questionRepo.getAnswers(id)).toHaveLength(3);
    })

    test(`getAnswers: shouldn't return any answer-data`, async () => {
      const question = await questionRepo.getQuestionById("12313")
      expect(await questionRepo.getAnswers(idEmptyCell)).toHaveLength(0);
    })

    test(`getAnswers: should throw an error cause input id format has not expected`, async () => {
      expect(await questionRepo.getAnswers("id")).toThrow('wrong input');
    })

    test(`getAnswers: should responce an empty array with not existing id`, async () => {
      expect(await questionRepo.getAnswers("1234")).toHaveLength(0);
    })

    test('getAnswer: should return one answer with that id', async () => {
      expect(await questionRepo.getAnswer(id, id)).toHaveLength(1);
    })

    test(`getAnswer: should return exact id: ${id}`, async () => {
      const answer = await questionRepo.getAnswer(id, id)
      expect(answer[0].id).toEqual(id);
    })

    test(`getAnswer: shouldn't return any data with not existing id`, async () => {
      const answer = await questionRepo.getAnswer(id,"12313")
      expect(answer).toHaveLength(0);
    })
    
    test(`getAnswer: should throw an error cause input id format has not expected`, async () => {
      expect(await questionRepo.getAnswer(id,"id")).toThrow('wrong input');
    })
  });

  describe("Testing dummy sample for POST requests:", () => {
    const id = faker.datatype.uuid();
    beforeEach(async () => {
      const testQuestions = [
        {
          id,
          summary: 'What is my name?',
          author: 'Jack London',
          answers: [{
            id,
            summary: 'Who?',
            author: 'Tim'
          },{
            id: faker.datatype.uuid(),
            summary: 'Where?',
            author: 'Jemmy'
          },{
            id: faker.datatype.uuid(),
            summary: 'When?',
            author: 'Derek'
          }]
        },
      ]
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    })

    const questionDummy = {
      id: 1234,
      summary: 'What?',
      author: 'Frank',
      answers: []
    };
    test(`addQuestion: should write question to data file`, async () => {
      await questionRepo.addQuestion(questionDummy)
      expect(await questionRepo.getQuestions()).toHaveLength(2);
    })

    const emptyDataQuestionDummy = {
      id,
      summary: '',
      author: 'Norman',
      answers: []
    }
    test(`addQuestion: should throw an error cause input data is empty`, async () => {
      expect(await questionRepo.addQuestion(id, emptyDataQuestionDummy)).toThrow('empty input');
    })

    const idTest = faker.datatype.uuid();
    const idTestQuestion = {
      idTest,
      summary: 'Any of them?',
      author: 'Norman',
      answers: []
    }
    test(`addQuestion: id should be random, not the one provided by req`, async () => {
      await questionRepo.addQuestion(idTestQuestion)
      expect(await questionRepo.getQuestionById(idTest)).toHaveLength(0);
    })

    const answerDummy = {
      id,
      summary: 'Who?',
      author: 'Norman',
    }
    test(`addAnswer: should write answer to data file`, async () => {
      await questionRepo.addAnswer(id, answerDummy)
      expect(await questionRepo.getAnswers(id)).toHaveLength(4);
    })

    const emptyDataAnswerDummy = {
      id,
      summary: '',
      author: 'Norman',
    }
    test(`addAnswer: should throw an error cause input data is empty`, async () => {
      expect(await questionRepo.addAnswer(id, emptyDataAnswerDummy)).toThrow('empty input');
    })

    const idTestAnswer = {
      idTest,
      summary: 'Any of them?',
      author: 'Norman',
    }
    test(`addAnswer: id should be random, not the one provided by req`, async () => {
      await questionRepo.addAnswer(id,idTestAnswer)
      expect(await questionRepo.getAnswer(id,idTest)).toHaveLength(0);
    })
  })
})
