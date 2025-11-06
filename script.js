
const { Sequelize, DataTypes } = require('sequelize');


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
    unique: true
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false
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
    allowNull: false
  },
  grupa: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  telefon: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false 
});

// Testăm conexiunea
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
    res.status(400).send(`<h2 style="color:red;">❌ Eroare: ${error.message}</h2>`);
  }
});


app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
