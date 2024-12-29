import { useState } from "react";
import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { Notification } from "./components/Notification";
import { useEffect } from "react";
import personService from "./services/persons";

const Entry = (props) => {
    return (
        <div>
            {props.name} {props.number}
            <button onClick={props.deletePerson}>Delete</button>
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newFilter, setNewFilter] = useState("");
    const [filtered, setFiltered] = useState(false);
    const [message, setMessage] = useState("Hi");
    const [ntfyClass, setNtfyClass] = useState("notification");

    useEffect(() => {
        personService.getAll().then((initialPersons) => {
            setPersons(initialPersons);
        });
    }, []);

    let personsToShow = filtered
        ? persons.filter((person) => {
              return person.name
                  .toLowerCase()
                  .includes(newFilter.toLowerCase());
          })
        : persons;

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    const handleFilterChange = (event) => {
        let value = event.target.value;
        setFiltered(value === "" ? false : true);
        setNewFilter(event.target.value);
    };

    const deletePerson = (id) => {
        let delName = persons.find((p) => p.id === id).name;
        let delIndex = persons.findIndex((p) => p.id === id);
        console.log(`Deleting :${delName} at ${delIndex}`);
        personService.deletePerson(id).then((res) => {
            console.log("deleted person", res);

            console.log("fuck");
            let newPersons = [...persons];
            newPersons.splice(delIndex, 1);
            setPersons(newPersons);
        });
    };

    const submitName = (event) => {
        event.preventDefault();

        let dupeIndex = null;
        persons.forEach((p, i) => {
            if (p.name === newName) {
                dupeIndex = i;
            }
        });
        console.log(dupeIndex);

        if (dupeIndex && persons[dupeIndex].number === newNumber) {
            //its a full dupe
            alert(`${newName} is already added to phonebook!`);
        } else {
            // not a full dupe so we are either creating or updating
            let newPerson = {
                name: newName,
                number: newNumber,
            };
            if (dupeIndex) {
                updatePerson(persons[dupeIndex].id, newPerson);
            } else {
                addPerson(newPerson);
            }
        }
    };

    const updatePerson = (id, newPerson) => {
        alert(
            `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        );
        personService
            .updatePerson(id, newPerson)
            .then((changedPerson) => {
                console.log(changedPerson.name, changedPerson.id);
                setPersons(
                    persons.map((p) =>
                        p.id === changedPerson.id ? changedPerson : p
                    )
                );
                setNewName("");
                setNewNumber("");
                setNtfyClass("notification");
                setMessage(
                    `Changed ${changedPerson.name}'s number to ${changedPerson.number}`
                );
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
            })
            .catch((err) => {
                // display error
                console.log(err);
                setNtfyClass("error");
                setMessage(
                    `Information of ${newPerson.name} has already been removed from server`
                );
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
                // remove the element fromt he data array
                setPersons(persons.filter((p) => p.name !== newPerson.name));
            });
    };

    const addPerson = (newPerson) => {
        let newPersons = [...persons];
        // POST to server
        personService.createPerson(newPerson).then((createdPerson) => {
            console.log(createdPerson);
            newPersons.push(createdPerson);
            console.log(newPersons);
            setPersons(newPersons);
            setNtfyClass("notification");
            setMessage(`Added ${createdPerson.name}`);
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }).catch(err => {
            console.log(err);
            setMessage(err.response.data.error);
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        });

        setNewName("");
        setNewNumber("");
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={message} className={ntfyClass} />
            <Filter
                newFilter={newFilter}
                handleFilterChange={handleFilterChange}
            />

            <h3>Add a new</h3>
            <PersonForm
                submitName={submitName}
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
            />
            <h3>Numbers</h3>
            <div>
                {personsToShow.map((person) => (
                    <Entry
                        key={person.id}
                        name={person.name}
                        number={person.number}
                        deletePerson={() => deletePerson(person.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
