const express = require('express'); 
const app = express();            
const PORT = 3000;                  

const { Sequelize, DataTypes } = require('sequelize');

app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize('balform', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false
  },
  logging: console.log
});


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Emailul nu este valid' }
    }
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [2, 50], msg: 'Numele trebuie să aibă între 2 și 50 de caractere' }
    }
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [2, 50], msg: 'Prenumele trebuie să aibă între 2 și 50 de caractere' }
    }
  },
  facultate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  an: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['I', 'II', 'III']],
        msg: 'Anul trebuie să fie între I și III'
      }
    }
  },
  grupa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Grupa trebuie să fie un număr' },
      min: { args: [1], msg: 'Grupa trebuie să fie cel puțin 1' }
    }
  },
  telefon: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: { args: [/^[0-9]{10}$/], msg: 'Numărul de telefon trebuie să aibă 10 cifre' }
    }
  }
}, {
  tableName: 'users',
  timestamps: false
});



sequelize.authenticate()
  .then(() => console.log('Conectare reușită la baza de date!'))
  .catch(err => console.error('Eroare la conectare:', err));


app.post('/formular', async (req, res) => {
  try {
    const { email, nume, prenume, facultate, serie, an, grupa, telefon } = req.body;

    const user = await User.create({
      email,
      nume,
      prenume,
      facultate,
      serie,
      an,
      grupa,
      telefon
    });

    console.log('Utilizator salvat:', user.toJSON());
    res.send('<h2 style="color:green;">Formular trimis cu succes!</h2>');

  } catch (error) {
    console.error('Eroare la inserare:', error);

    if (error.name === 'SequelizeValidationError') {
      
      const messages = error.errors.map(e => e.message).join('<br>');
      res.status(400).send(`<h2 style="color:red;">Eroare de validare:</h2><p>${messages}</p>`);
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).send('<h2 style="color:red;">Acest email este deja înregistrat.</h2>');
    } else {
      res.status(400).send(`<h2 style="color:red;">Eroare: ${error.message}</h2>`);
    }
  }
});



app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
