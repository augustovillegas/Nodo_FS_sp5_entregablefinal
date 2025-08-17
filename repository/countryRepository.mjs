import { Country } from "../models/country.mjs";
import { IRepository } from "./IRespository.mjs";

class CountryRepository extends IRepository {
  async obtenerTodos() {
    console.log("📚 [REPO] find all");
    return await Country.find({});
  }

  async obtenerPorId(id) {
    console.log("📚 [REPO] findById", id);
    return await Country.findById(id);
  }

  async obtenerPorNombreOficial(nombreOficial) {
    console.log("📚 [REPO] findOne name.official:", nombreOficial);
    return await Country.findOne({ "name.official": nombreOficial });
  }

  async crear(data) {
    console.log("✍️  [REPO] create", data?.name?.official);
    return await Country.create(data);
  }

  async actualizar(id, data) {
    console.log("✍️  [REPO] updateById", id);
    return await Country.findByIdAndUpdate(id, data, { new: true });
  }

  async eliminar(id) {
    console.log("🗑️  [REPO] deleteById", id);
    return await Country.findByIdAndDelete(id);
  }

  async eliminarPorNombreOficial(nombreOficial) {
    console.log("🗑️  [REPO] deleteOne name.official:", nombreOficial);
    return await Country.findOneAndDelete({ "name.official": nombreOficial });
  }  
}

export default new CountryRepository();
