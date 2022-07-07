const { readFile, writeFile } = require('fs/promises')
const { faker } = require('@faker-js/faker')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await getQuestions()
    return questions.filter(question => question.id === questionId)
  }

  const addQuestion = async question => {
    let questions = await getQuestions();
    questions.push({
      id: faker.datatype.uuid(),
      author: question.author,
      summary: question.summary,
      answers: question.answers,
    })
    const newData = JSON.stringify(questions)
    await writeFile(fileName, newData)

  }

  const getAnswers = async questionId => {
    const question = await getQuestionById(questionId)
    return question.length === 0 ? question : question[0].answers
  }

  const getAnswer = async (questionId, answerId) => {
    const answers = await getAnswers(questionId);
    return answers.filter(answer => answer.id === answerId)
  }

  const addAnswer = async (questionId, answer) => {
    console.log(questionId, answer)
    let questions = await getQuestions()
    console.log('before pushing', questions)
    questions = questions.map(question => {
      if (question.id === questionId){
        question.answers.push({
          id: faker.datatype.uuid(),
          author: answer.author,
          summary: answer.summary,
        })
        return question
      }
      return question
    })
    const newData = JSON.stringify(questions)
    await writeFile(fileName, newData)
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
