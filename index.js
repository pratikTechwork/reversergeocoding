const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    host: 'db.mgampbhmlnalxohuobpr.supabase.co',
    database: "postgres",
    password: 'gplVhDuxLDMeBKxs',
    port: 5432,
});
let scanlogs = []
async function querydb(){
    let data = await pool.query(`select id, qr_id,scan_1_location from scan_log`);
    scanlogs = data.rows
    getcity()
}
querydb()

function getcity(){
    for (let index = 0; index < scanlogs.length; index++) {
       setTimeout(()=>{
        let lat = scanlogs[index].scan_1_location[0]
        let lon = scanlogs[index].scan_1_location[1]
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=d5c9c5f68ffa4f3ea831255e056215de`)
          .then(response => response.json())
          .then(async result =>{
            console.log(result.features[0].properties.state)
            let statename = result.features[0].properties.state
            await pool.query(`update scan_log set state='${statename}' where id=${scanlogs[index].id}`);
          })
          .catch(error => console.log('error', error));
       },1000 * index)
    }
}
