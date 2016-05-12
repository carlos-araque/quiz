'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

      return queryInterface.bulkInsert('Quizzes', [
         { question: 'Capital de Italia', answer: 'Roma',
           tematica: 'geografia',
           createdAt: new Date(), updatedAt: new Date() },
         { question: 'Capital de Portugal', answer: 'Lisboa',
           tematica: 'geografia',
           createdAt: new Date(), updatedAt: new Date() },
         { question: 'Capital de España', answer: 'Madrid',
           tematica: 'geografia',
           createdAt: new Date(), updatedAt: new Date() },
        ]);
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('Quizzes', null, {});
  }
};
