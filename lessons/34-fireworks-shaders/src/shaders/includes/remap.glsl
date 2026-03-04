float remap(
    float value,                // the value you want to remap
    float originMin,            // start of the original range
    float originMax,            // end of the original range
    float destinationMin,       // start of the destination range
    float destinationMax        // end of destination range
) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}