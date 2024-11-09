# API de Gestión de Productos y Registros

## Descripción

Esta API permite gestionar productos y registros de ingresos y gastos en el sistema. Los usuarios pueden crear, leer, actualizar y eliminar productos y registros.

## URL base

`http://localhost:3000`

### **Productos**

#### 1. Obtener todos los productos

- **URL**: `/api/product`
- **Método**: `GET`
- **Descripción**: Retorna todos los productos de la base de datos.

#### Ejemplo de solicitud:

```javascript
fetch('https://api.miapp.com/api/product', {
  method: 'GET',
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### Ejemplo de respuesta exitosa:

```json
[
  {
    "product_id": 1,
    "product_name": "Producto A",
    "product_stock": 50,
    "volume_id": 2
  },
  {
    "product_id": 2,
    "product_name": "Producto B",
    "product_stock": 30,
    "volume_id": 3
  }
]
```

#### 2. Crear un nuevo producto
- **URL**: `/api/product`
- **Método**: `POST`
- **Descripción**: Crea un nuevo producto.
Parámetros del cuerpo de la solicitud:

```json
{
  "product_name": "string", // Obligatorio
  "product_stock": 100, // Obligatorio
  "volume_id": 1 // Obligatorio
}
```

#### Ejemplo de solicitud:

```js
fetch('https://api.miapp.com/api/product', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "product_name": "Nuevo Producto",
    "product_stock": 100,
    "volume_id": 1
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));


```

#### Ejemplo de respuesta exitosa (201 Created):

```powershell
{
  "product_name": "string",  // Obligatorio
  "product_stock": 100,      // Obligatorio
  "volume_id": 1             // Obligatorio
}

```

#### 3. Actualizar un producto
- **URL**: `/api/product/:id`
- **Método**: `PUT`
- **Descripción**: Actualiza la información de un producto según el id del producto.

Parámetros del cuerpo de la solicitud:
```json
{
  "product_id": 3,          // Obligatorio
  "product_name": "string",  // Opcional
  "product_stock": 120,      // Opcional
  "volume_id": 2             // Opcional
}
```

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/product/3', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "product_name": "Producto Actualizado",
    "product_stock": 120,
    "volume_id": 2
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

Ejemplo de respuesta exitosa (200 OK):
```json
{
  "product_id": 3,          // Obligatorio
  "product_name": "string",  // Opcional
  "product_stock": 120,      // Opcional
  "volume_id": 2             // Opcional
}

```

### Registros
#### 1. Obtener registros de ingresos
- **URL**: `/api/record/incomes`
- **Método**: `GET`
- **Descripción**: Retorna todos los registros relacionados con nuevos ingresos.

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record/incomes', {
  method: 'GET',
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

Ejemplo de respuesta exitosa (200 OK):
```json
[
  {
    "record_id": 1,
    "product_id": 3,
    "user_id": 2,
    "record_type_id": 1,
    "record_quantity": 50,
    "record_date": "2024-09-14"
  }
]
```

#### 2. Obtener registros de gastos
- **URL**: `/api/record/expense`
- **Método**: `GET`
- **Descripción**: Retorna todos los registros relacionados con gastos.

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record/expense', {
  method: 'GET',
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

#### 3. Obtener todos los registros
- **URL**: `/api/record/all`
- **Método**: `GET`
- **Descripción**: Retorna todos los registros.

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record/all', {
  method: 'GET',
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
#### 4. Actualizar un registro
- **URL**: `/api/record/:id`
- **Método**: `PUT`
- **Descripción**: Actualiza un registro según el id del registro.


Parámetros del cuerpo de la solicitud:
```json
{
  "record_id": 1,          // Obligatorio
  "product_id": 3,         // Obligatorio
  "user_id": 2,            // Opcional
  "record_type_id": 1,     // Opcional
  "record_quantity": 60,   // Opcional
  "record_date": "2024-09-15" // Opcional
}
```

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "record_quantity": 60
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

Ejemplo de respuesta exitosa (200 OK):
```json
{
  "status": "success",
  "data": {
    "record_id": 1,
    "product_id": 3,
    "user_id": 2,
    "record_type_id": 1,
    "record_quantity": 60,
    "record_date": "2024-09-15"
  }
}
```

#### 5. Eliminar un registro
- **URL**: `/api/record/:id`
- **Método**: `DELETE`
- **Descripción**: Elimina un registro según el id del registro.


Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record/1', {
  method: 'DELETE',
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

#### 6. Crear un nuevo registro
- **URL**: `/api/record`
- **Método**: `POST`
- **Descripción**: Crea un nuevo registro en el sistema.

Parámetros del cuerpo de la solicitud:
```json
{
  "record_id": 1,          // Obligatorio
  "product_id": 3,         // Obligatorio
  "user_id": 2,            // Obligatorio
  "record_type_id": 1,     // Obligatorio
  "record_quantity": 50,   // Obligatorio
  "record_date": "2024-09-14" // Obligatorio
}

```

Ejemplo de solicitud:
```js
fetch('https://api.miapp.com/api/record', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "record_id": 1,
    "product_id": 3,
    "user_id": 2,
    "record_type_id": 1,
    "record_quantity": 50,
    "record_date": "2024-09-14"
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

```

Ejemplo de respuesta exitosa (201 Created):
```json
{
  "record_id": 1,          // Obligatorio
  "product_id": 3,         // Obligatorio
  "user_id": 2,            // Obligatorio
  "record_type_id": 1,     // Obligatorio
  "record_quantity": 50,   // Obligatorio
  "record_date": "2024-09-14" // Obligatorio
}
```
