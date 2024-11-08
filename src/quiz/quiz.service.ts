import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from './models/quiz.models';
import { Model } from 'mongoose';
import { QuizTrial } from './dto/Quiztrial.dto';
import { CreateQuiz } from './dto/CreateQuiz.dto';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<Quiz>) {}

  async getAllQuiz() {
    const quizes = await this.quizModel.find(
      {},
      {
        questions: 0,
      },
    );

    return {
      status: 200,
      data: {
        quizes,
      },
    };
  }

  async getAQuiz(id: string) {
    const quiz = await this.quizModel.findById(id, {
      // 'questions.correctAnswer': 0,
    });

    return {
      status: 200,
      data: {
        quiz,
      },
    };
  }

  async solveQuiz(body: QuizTrial) {
    const quiz = await this.quizModel.findById(body.quiz_id);

    let correctCount = 0;

    const questionAnswer = quiz.questions.map((ques: any) => ({
      answer: ques.correctAnswer,
      question_id: ques._id?.toString(),
    }));

    const answerMap = new Map();
    questionAnswer.forEach(({ question_id, answer }) => {
      answerMap.set(question_id, answer);
    });

    body.answers.forEach(({ question_id, answer }) => {
      if (answerMap.get(question_id) === answer) {
        correctCount++;
      }
    });

    return {
      status: 200,
      data: {
        correctCount,
        totalCount: questionAnswer.length,
      },
    };
  }

  async createQuiz(body: CreateQuiz) {
    const quiz = await this.quizModel.create(body);

    return {
      status: 200,
      message: 'Successfully created quiz',
      data: {
        quiz,
      },
    };
  }
}
