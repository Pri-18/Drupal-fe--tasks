(function ($, Drupal, once) {

  const STORAGE_KEY = 'todoListHtml';

  function updateTodoCount() {
    const count = $('.todo-item').length;
    $('.todo-count').text(Drupal.t(count));
  }

  function loadListState(todoList) {
    let savedHtml = localStorage.getItem(STORAGE_KEY);
    if (savedHtml) {
      todoList.html(savedHtml);
    }
  }

  function saveTasksToStorage(todoList) {
    let listHtml = todoList.html();
    localStorage.setItem(STORAGE_KEY, listHtml);
  }

  function renderTask(taskText, todoList) {
    const trimmedText = taskText.trim();
    if (trimmedText !== '') {
      const listItem = $('<li>').addClass('todo-item');
      const taskSpan = $('<span>').addClass('task-text').text(trimmedText);

      let checkBox = $('<span>').addClass('checkbox').attr('title', Drupal.t('Mark as Done')).html('<i class="fa-regular fa-square-check"></i>');

      let deleteButton = $('<span>').addClass('delete-task').attr('title', Drupal.t('Delete task'))
        .html('<i class="fa-solid fa-trash-can"></i>');

      listItem
        .append(checkBox)
        .append(taskSpan)
        .append(deleteButton);

      todoList.append(listItem);
    }
  }

  Drupal.behaviors.todoUI = {
    attach: function (context) {
      const todoContainer = $(context).find('#todo-app-container')

      const todoList = todoContainer.find('.todo__list')
      const inputField = todoContainer.find('#new-task-id')

      if (todoList.length && todoList.is(':empty')) {
        loadListState(todoList);
      }

      once('add-todo', '.add-todo', context).forEach(element => {
        $(element).on('click', function (e) {
          e.preventDefault();
          const taskText = inputField.val() || '';

          if (taskText.trim() !== '') {
            updateTodoCount();
            renderTask(taskText, todoList);
            inputField.val('');
            saveTasksToStorage(todoList);
            updateTodoCount();
          }
        });

        inputField.on('keypress', function (e) {
          if (e.key === 'Enter') {
            $(element).trigger('click');
          }
        });
      });

      $(context).on('click', '.checkbox', function (e) {
        e.preventDefault();

        const listItem = $(this).closest('.todo-item');
        const icon = $(this).find('i');

        listItem.toggleClass('done');

        if (listItem.hasClass('done')) {
          icon.removeClass('fa-regular fa-square').addClass('fa-solid fa-square-check');
        } else {
          icon.removeClass('fa-solid').addClass('fa-regular');
        }

        saveTasksToStorage(todoList);
      });

      $(context).on('click', '.delete-task', function (e) {
        e.preventDefault();

        const item = $(this).closest('.todo-item');
        item.addClass('fade-out');

        setTimeout(() => {
          item.remove();
          saveTasksToStorage(todoList);
          updateTodoCount();
        }, 400);
      });

    updateTodoCount();

    }
  };
})(jQuery, Drupal, once);
