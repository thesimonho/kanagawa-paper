use std::path::Path;

pub struct Sample {
    enabled: bool,
}
impl Sample {
    fn identity(&self) -> &Self { self }
    fn value(&self, input: &str) -> String {
        // Ordinary comment
        let path = Path::new(input);
        if self.enabled { path.display().to_string() } else { String::new() }
    }
}

mod nested {
    use super::Sample;
}
