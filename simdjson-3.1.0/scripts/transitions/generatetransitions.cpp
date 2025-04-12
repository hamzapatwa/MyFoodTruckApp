#include "../src/stage3_ape_machine.cpp"

int main() {
  init_state_machine();
  std::cout << "// automatically generated by generatetransitions.cpp"
            << std::endl;
  std::cout << " u32 trans[MAX_STATES][256] = {" << std::endl;
  for (int k = 0; k < MAX_STATES; k++) {
    std::cout << "{";
    for (int z = 0; z < 255; z++) {
      std::cout << trans[k][z] << ",";
    }
    std::cout << trans[k][255];
    std::cout << "}";
    if (k + 1 < MAX_STATES)
      std::cout << ",";
    std::cout << std::endl;
  }
  std::cout << "};" << std::endl;
}
