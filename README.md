# country-select
Компонент VueJS2 для выбора страны.
 
Country select VueJS2 component.

[Пример (Example)](http://insbor.ru/vue/country-select/ "Component example")

![Пример (example)](http://insbor.ru/vue/country-select/assets/img/country-select-example.png "Пример (example)")

```html
<country-select
        v-model="selectedCountry"
        :countries="countries"
        :allow-empty="true"
        placeholder="Выберите страну"
>
</country-select>
```

Список стран передаётся из родительского компонента в виде массива объектов вида 
```js
[
    {id:"AU", name:"Австралия"},
    {id:"AT", name:"Австрия"},
    {id:"AZ", name:"Азербайджан"},
    // . . . //
    {id:"JP", name:"Япония"}
]
```
По символьному ID получается адрес изображения с флагом. 
Например, для России - `/assets/img/flags/{ширина в пикселях}/RU.png`