# Создать телефонный справочник с возможностью импорта и экспорта данных в формате .txt.
# Фамилия, имя, отчество, номер телефона - данные, которые должны находиться в файле.

# Программа должна выводить данные
# Программа должна сохранять данные в текстовом файле
# Пользователь может ввести одну из характеристик для поиска определенной записи(Например имя или фамилию человека)
# Использование функций. Ваша программа не должна быть линейной

def data_input():
    with open('data.txt', 'a', encoding='utf-8') as file:
        file.write(input('Введите данные: ') + '\n')


def data_search(search):
    out_list = []
    with open('data.txt', 'r', encoding='utf-8') as file:
        book = file.read().split('\n')
        empty = True
        for text in book:
            if search.lower() in str(text).lower():
                print(text)
                out_list.append(text)
                empty = False
        if empty:
            print(f'\n Значение {search} не найдено \n')
        return out_list


def data_out():
    with open('data.txt', 'r', encoding='utf-8') as file:
        book = file.read().split('\n')
        for i in range(len(book)-1):
            print(i+1, '. ', book[i])


def rewrite_files(book):
    with open('data.txt', 'w', encoding='utf-8') as file:
        file.writelines('')
    with open('data.txt', 'a', encoding='utf-8') as file:
        for i in book:
            if len(i) > 0:
                i = i+'\n'
            file.write(i)
    print('\n Список после редактирования:')
    data_out()


def data_delete():
    out_list = data_search(search=input('Введите для удаления: '))
    if len(out_list)>= 1:
        del_line=int(input('Требуется уточнение. Введите номер строки для удаления: '))
    del_string = int(input('Введите номер строки для удаления: '))
    with open('data.txt', 'r', encoding='utf-8') as file:
        book = file.read().split('\n')
    del book[del_string-1]
    rewrite_files(book)


def data_update():
    data_out()
    update_string = int(input('Введите номер строки для редактирования: '))
    with open('data.txt', 'r', encoding='utf-8') as file:
        book = file.read().split('\n')
    book[update_string-1] = input('Введите новое значение: ')
    rewrite_files(book)


while True:
    mode = input('\n Комманды телефонной книги:\
                \n 1 - Внести данные\
                \n 2 - Поиск\
                \n 3 - Вывод всего справочника\
                \n 4 - Удалене записи\
                \n 5 - Редактирование записи\
                \n 0 - Выход\
                \n Ввод => ')
    if mode == '0':
        break
    elif mode == '1':
        data_input()
    elif mode == '2':
        data_search(search=input('Введите данные для поиска: '))
    elif mode == '3':
        data_out()
    elif mode == '4':
        data_delete()
    elif mode == '5':
        data_update()
    else:
        print('Неверный ввод. Введите значение из списка')
