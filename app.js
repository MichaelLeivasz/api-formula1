import express from 'express';
import { drivers } from './data.js';
import { randomUUID } from 'node:crypto';

const baseRoute = '/api/v1';

const app = express();

app.use(express.json());

app.get(baseRoute + '/drivers', (req, res) => {
    res.status(200).send(drivers);
});

app.get(baseRoute + '/drivers/standings/:position', (req, res) => {
    const { position } = req.params;
    const selectedDriver = drivers[position - 1];
    res.status(200).send(selectedDriver);
});

app.get(baseRoute + '/drivers/:id', (req, res) => {
    const { id } = req.params;
    const selectedDriver = drivers.find((driver) => driver.id === id);

    if (!selectedDriver) {
        res.status(404).send('Driver not found');
        return;
    }

    res.status(200).send(selectedDriver);
});

app.post(baseRoute + '/drivers', (req, res) => {
    const newDriver = { ...req.body, id: randomUUID() };
    drivers.push(newDriver);
    drivers.sort((b, a) => {
        if (a.points > b.points) {
            return 1;
        }
        if (b.points > a.points) {
            return -1;
        }
        return 0;
    });
    res.status(200).send(newDriver);
});

app.put(baseRoute + '/drivers/:id', (req, res) => {
    const { id } = req.params;
    const selectedDriver = drivers.find((d) => d.id === id);

    if (!selectedDriver) {
        res.status(404).send('Driver not found');
        return;
    }

    for (const key in selectedDriver) {
        if (req.body[key]) {
            selectedDriver[key] = req.body[key];
        }
    }
    drivers.sort((b, a) => {
        if (a.points > b.points) {
            return 1;
        }
        if (b.points > a.points) {
            return -1;
        }
        return 0;
    });
    res.status(200).send(selectedDriver);
});

app.delete(baseRoute + '/drivers/:id', (req, res) => {
    const { id } = req.params;
    const selectedDriver = drivers.find((d) => d.id === id);

    const index = drivers.indexOf(selectedDriver);
    drivers.splice(index, 1);
    res.status(200).send(selectedDriver);
});

const port = 3000;
app.listen(port, () => console.log('API rodando com sucesso'));
