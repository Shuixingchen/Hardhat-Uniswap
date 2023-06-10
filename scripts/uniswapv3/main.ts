import{quoteSingle,quoteMutile} from './libs/quote'

async function main() {
    let num = await quoteMutile()
    console.log(num)
}


main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
