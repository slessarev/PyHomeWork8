def data_input():
    with open('data.txt', 'a', encoding='utf-8') as file:
        file.write(input('Введите данные: ') + '\n')


def data_search(search):
    out_list = []
    with open('data.txt', 'r', encoding='utf-8') as file:
        book = file.read().split('\n')
        empty = True
        j=0
        for i in book:
            if search.lower() in str(i.lower()):
                print(j+1, ' - ', i)
                out_list.append(i)
                j+=1
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

#Если в результате поиска несколько значений то уточняем номер для удаления
    if len(out_list)> 1: 
        del_string=int(input('Требуется уточнение. Введите номер строки для удаления: '))
        with open('data.txt', 'r', encoding='utf-8') as file:
           book = file.read().split('\n')
        new_book = []
        for i in range(len(book)):
            if book[i] != out_list[del_string-1]:
                new_book.append(book[i])
        rewrite_files(new_book)

# Если только одно то сразу удаляем
    else:
        with open('data.txt', 'r', encoding='utf-8') as file:
            book = file.read().split('\n')
        new_book = []
        for i in range(len(book)):
            if book[i] != out_list[0]:
                new_book.append(book[i])
        rewrite_files(new_book)

   


def data_update():
    update_string = data_search(search=input('Какую запись редактируем?: '))

    #Если в результате поиска несколько значений то уточняем номер для удаления
    if len(update_string)> 1: 
        del_string=int(input('Требуется уточнение. Введите номер строки для редактирования: '))
        with open('data.txt', 'r', encoding='utf-8') as file:
           book = file.read().split('\n')
        new_book = []
        for i in range(len(book)):
            if book[i] != update_string[del_string-1]:
                new_book.append(book[i])
            else:
                new_book.append(input('Введите новое значение: '))
        rewrite_files(new_book)

# Если только одно то сразу меняем
    else:
        with open('data.txt', 'r', encoding='utf-8') as file:
            book = file.read().split('\n')
        new_book = []
        for i in range(len(book)):
            if book[i] != update_string[0]:
                new_book.append(book[i])
            else:
                new_book.append(input('Введите новое значение: '))
        rewrite_files(new_book)
