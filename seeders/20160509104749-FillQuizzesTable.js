'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Quizzes',{
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
        },
        question: {
           type: Sequelize.STRING,
           validate: { notEmpty: {msg: "Falta Pregunta"} }
        },
        answer: {
          type: Sequelize.STRING,
          validate: { notEmpty: {msg: "Falta Respuesta"} }
        },
        tematica: {
          type: Sequelize.STRING,
          validate: { notEmpty: {msg: "Falta Tematica"} }
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      { sync: {force: true} }
    );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Quizzes');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
