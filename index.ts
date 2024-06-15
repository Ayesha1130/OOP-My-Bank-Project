#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

interface BankAccount {
  accountNumber: number;
  balance: number;
  withdraw(amount: number): void;
  deposit(amount: number): void;
  checkbalance(): void;
}
class BankAccount implements BankAccount {
  accountNumber: number;
  balance: number;

  constructor(accountNumber: number, balance: number) {
    this.accountNumber = accountNumber;
    this.balance = balance;
  }
  withdraw(amount: number): void {
    if (this.balance >= amount) {
      this.balance -= amount;
      console.log(chalk.blueBright.bold.italic(
        `Withdrawal of $${amount} successful. your remaining balance is $${this.balance}`
      ));
    } else {
      console.log("insufficient balance");
    }
  }

  deposit(amount: number): void {
    if (amount > 100) {
      amount -= 1;
      this.balance += amount;
      console.log(chalk.magenta.bold.italic(
        `Deposit of $${amount} successful. your remaining balance is $${this.balance}`
      ));
    }
  }
  checkbalance(): void {
    console.log(chalk.green.bold.italic(`Your Current Balance Is $${this.balance}`));
  }
}

class Customer {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  mobileNumber: number;
  account: BankAccount;

  constructor(
    firstName: string,
    lastName: string,
    age: number,
    gender: string,
    mobileNumber: number,
    account: BankAccount
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.mobileNumber = mobileNumber;
    this.account = account;
  }
}

const accounts: BankAccount[] = [
  new BankAccount(1001, 500),
  new BankAccount(1002, 1000),
  new BankAccount(1003, 1000),
];

const customers: Customer[] = [
  new Customer("Ahmad Raza", "Sheikh", 25, "Male", 1234567800, accounts[0]),
  new Customer("Hina", "Naseer", 30, "Female", 12345600, accounts[1]),
  new Customer("Ayesha", "Iqbal", 24, "Female", 123456700, accounts[2]),
];

async function service() {
  while (true) {
    const accountNumberInput = await inquirer.prompt([
      {
        type: "number",
        name: "accountNumber",
        message: "Enter your account number",
      }
    ]);
    const customer = customers.find(c => c.account.accountNumber === accountNumberInput.accountNumber);
    if (customer) {
      console.log(chalk.magenta.bold.italic(`Welcome ${customer.firstName} ${customer.lastName}!\n`));
      
      const ans = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: (chalk.magenta.italic("What would you like to do?")),
          choices: ["Withdraw", "Deposit", "Check Balance", "Exit"],
        }
      ]);
      switch (ans.action) {
        case "Withdraw":
          const withdrawAmount = await inquirer.prompt([
            {
              type: "number",
              name: "amount",
              message:(chalk.green.italic("How much would you like to withdraw?")),
            },
          ]);
          customer.account.withdraw(withdrawAmount.amount);
          break;
        case "Deposit":
          const depositAmount = await inquirer.prompt([
            {
              type: "number",
              name: "amount",
              message: (chalk.magenta.italic("How much would you like to deposit?")),
            },
          ]);
          customer.account.deposit(depositAmount.amount);
          break;
        case "Check Balance":
          customer.account.checkbalance();
          break;
        case "Exit":
          console.log(chalk.blue.bold.italic("Exiting bank program....."));
          console.log(chalk.magenta.bold.italic(
            "\nThank you for using our bank services.Have a great time !"
          ));
          return;
        }
    } else {
      console.log(chalk.red.bold.italic("Invalid account number. Please Try Again"));
    }
  }
}
service();
